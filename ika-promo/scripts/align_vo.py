# Forced alignment of the ElevenLabs VO against the known script (pocketsphinx).
# Usage: python3 scripts/align_vo.py vo16k.wav transcript.txt words.json
# The word times feed the cue sheet in src/vo.json.
from pocketsphinx import Decoder
import wave, json, sys
def mk():
    d=Decoder(samprate=16000, bestpath=False)
    for wd,ph in [("ika","IY K AH"),("gm","JH IY EH M"),("dwallets","D IY W AA L AH T S"),("defi","D IY F AY"),("ai","EY AY"),("crypto","K R IH P T OW"),("solana","S OW L AA N AH"),("ethereum","IH TH IH R IY AH M")]:
        if d.lookup_word(wd) is None: d.add_word(wd,ph,True)
    return d
def align(data, text):
    d=mk(); d.set_align_text(text)
    d.start_utt(); d.process_raw(data,full_utt=True); d.end_utt()
    d.set_alignment()
    d.start_utt(); d.process_raw(data,full_utt=True); d.end_utt()
    al=d.get_alignment()
    return None if al is None else [(s.name,s.start/100,(s.start+s.duration)/100) for s in al]
if __name__=='__main__':
    T=open(sys.argv[2]).read().strip()
    w=wave.open(sys.argv[1],'rb'); data=w.readframes(w.getnframes())
    out=align(data,T)
    json.dump(out,open(sys.argv[3],'w'))
    print(' '.join(f"{n}@{a:.2f}" for n,a,b in out) if out else 'FAILED')
