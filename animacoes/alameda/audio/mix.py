import json, numpy as np, scipy.io.wavfile as w
from scipy.signal import butter, sosfilt, resample
SR = 48000; DUR = 42.0; N = int(SR * DUR)
out = {k: np.zeros((N, 2), np.float32) for k in ['music', 'amb', 'sfx']}
db = lambda d: 10 ** (d / 20)
def load(n):
    sr, x = w.read(n + '.wav'); return x.astype(np.float32)
def rms(x): return np.sqrt((x ** 2).mean()) + 1e-9
def norm_peak(x, d): return x * db(d) / (abs(x).max() + 1e-9)
def norm_rms(x, d): return x * db(d) / rms(x)
def filt(x, kind, fc, order=2): return sosfilt(butter(order, fc, kind, fs=SR, output='sos'), x, axis=0).astype(np.float32)
def rate(x, r): return resample(x, int(len(x) / r), axis=0).astype(np.float32) if r != 1 else x
def fades(x, fi=0.0, fo=0.0):
    x = x.copy(); n = len(x)
    if fi: k = min(n, int(fi * SR)); x[:k] *= np.linspace(0, 1, k)[:, None]
    if fo: k = min(n, int(fo * SR)); x[n - k:] *= np.linspace(1, 0, k)[:, None]
    return x
def pan(x, p):  # -1 esquerda .. 1 direita
    return x * np.array([np.sqrt((1 - p) / 2), np.sqrt((1 + p) / 2)], np.float32) * 1.414
def put(bus, x, t):
    i = int(t * SR)
    if i < 0: x = x[-i:]; i = 0
    n = min(len(x), N - i)
    if n > 0: out[bus][i:i + n] += x[:n]
def loop(x, n, xf=0.5):
    k = int(xf * SR); y = x.copy()
    while len(y) < n:
        a = y[-k:] * np.linspace(1, 0, k)[:, None] + x[:k] * np.linspace(0, 1, k)[:, None]
        y = np.concatenate([y[:-k], a, x[k:]])
    return y[:n]
def env_at(times, vals):  # envelope por amostra a partir de pontos (s, dB)
    t = np.arange(N) / SR; return db(np.interp(t, times, vals)).astype(np.float32)[:, None]

# ---------- Trilha ----------
m = load('music2')[:N]
m = fades(m, 0, 0.6)
out['music'][:len(m)] += m

# ---------- Ambiência de obra (desde o tapume até a entrega) ----------
a = np.concatenate([fades(load('amb1'), 0, 1.0)[:-int(SR)], load('amb2')])
a = norm_rms(filt(a, 'highpass', 70), -33)
a = loop(a, N)
out['amb'] += a * env_at([0, 1.4, 3.0, 28.5, 31.5, 42], [-60, -60, 0, 0, -60, -60])

# ---------- Grua: motor seguindo o movimento real (giro, carrinho e guincho) ----------
J = json.load(open('crane.json')); fr = np.array(J['fr'])
ang, r, y, down = fr[:, 0], fr[:, 1], fr[:, 2], fr[:, 3]
dang = np.abs(np.diff(np.unwrap(ang), prepend=ang[0])) * 30
spd = dang * 18 + np.abs(np.diff(r, prepend=r[0])) * 30 * 0.6 + np.abs(np.diff(y, prepend=y[0])) * 30 * 0.8
vis = 1 - down
erect = np.abs(np.diff(down, prepend=down[0])) * 30 * 6
act = np.clip(spd / 14, 0, 1) * vis + np.clip(erect, 0, 1)
act = np.convolve(act, np.ones(5) / 5, 'same')
tf = np.arange(len(act)) / 30
g = np.interp(np.arange(N) / SR, tf, act).astype(np.float32)[:, None]
c = norm_rms(filt(filt(load('crane'), 'lowpass', 7000), 'highpass', 90), -32.5)
c = pan(loop(c, N, 0.3), -0.35)  # grua à esquerda do quadro
out['sfx'] += c * (0.12 + 0.88 * g) * (np.interp(np.arange(N) / SR, tf, np.clip(vis * 3, 0, 1)).astype(np.float32)[:, None])

# Carga apoiada: batida metálica em cada descida, com afinação variada
rng = np.random.default_rng(7)
clk = load('clank')
for d in J['drops']:
    rr = rng.uniform(0.82, 1.12) * (0.78 if d['load'] in ('cage', 'cform') else 1)
    x = norm_peak(filt(rate(clk, rr), 'lowpass', 9000), -19 + rng.uniform(-2, 1.5))
    put('sfx', pan(x, rng.uniform(-0.3, 0.3)), d['t'] / 30 - 0.02)

# ---------- Fundação: escavação e bate-estaca ----------
put('sfx', fades(norm_peak(load('piles'), -9), 0.15, 0.6), 3.0)
# concretagem das vigas baldrame e de cada laje (curta, sob a música)
pr = load('pour')
put('sfx', fades(norm_rms(pr, -31), 0.3, 0.8), 6.6)
for k in range(9):
    s = (252 + k * 32 + 16) / 30
    seg = pr[int((k % 3) * 0.8 * SR):][:int(1.0 * SR)]
    put('sfx', pan(fades(norm_rms(seg, -35), 0.12, 0.4), 0.15), s)

# ---------- Desmontagem da grua ----------
put('sfx', pan(fades(norm_peak(rate(load('down'), 1.18), -11), 0.3, 0.4), -0.4), 18.15)

# ---------- Alvenaria e fachada ----------
b = norm_rms(filt(load('brick'), 'highpass', 150), -30)
put('sfx', pan(fades(b, 0.8, 1.5), 0.2), 19.6)
put('sfx', pan(fades(b[::-1].copy()[:int(5 * SR)], 1.0, 1.5) * 0.7, -0.1), 26.0)

# ---------- Entrega: bairro, pássaros ----------
bd = loop(norm_rms(load('birds'), -33), int(13 * SR), 0.8)
put('amb', fades(bd, 2.0, 1.5), 29.0)

# ---------- Projeto: desenho surgindo ----------
bl = load('blue')
put('sfx', fades(norm_peak(bl, -15), 0.02, 0.8), 0.35)
put('sfx', pan(fades(norm_peak(rate(bl, 1.25), -21), 0.02, 0.6), 0.3), 1.6)

# ---------- Transições de etapa ----------
wh = load('whoosh')
for t, p in [(100, 0.4), (252, -0.4), (545, 0.4), (665, -0.4), (905, 0.4)]:
    put('sfx', pan(norm_peak(filt(wh, 'highpass', 200), -16), p), t / 30 - 0.28)

# ---------- Final: assinatura ----------
put('sfx', fades(norm_peak(load('logo2'), -8), 0, 0.5), 38.3 - 2.0)

mix = out['music'] * db(0) + out['amb'] * db(0) + out['sfx'] * db(0)
mix = fades(mix, 0.05, 0.3)
w.write('mix.wav', SR, mix.astype(np.float32))
for k, v in out.items(): w.write(f'stem_{k}.wav', SR, v)
print('peak', 20 * np.log10(abs(mix).max()), 'rms', 20 * np.log10(rms(mix)))
