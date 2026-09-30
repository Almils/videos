# Ika — "Just Ink." · Voice-over script

**Runtime:** ~52 s · **Tone:** playful, confident, a little smug about the state of web3 · **Pace:** ~2.7 words/sec, punchy

The narrator *is* Ika the squid. Think a friendly, slightly cheeky tech host: grinning, not shouting.

---

## Script (read this into ElevenLabs)

| # | Scene (on screen) | Time | Line |
|---|---|---|---|
| 1 | Logo burst | 0.0–2.2s | *(no VO: sound design only)* |
| 2 | Squid pops out, `イカ = squid` | 2.2–5.8s | **gm! I'm Ika. That's Japanese for squid.** |
| 3 | "welcome to Ika." | 5.8–8.4s | **Welcome to Ika.** |
| 4 | "Moving crypto in 2026:" · Wrap it / Bridge it / …and pray | 8.4–13.6s | **Moving crypto in 2026? Wrap it. Bridge it… and pray.** |
| 5 | "Billions drained." · Ronin / Wormhole / Nomad stamped DRAINED | 13.6–18.0s | **Billions later, bridges are *still* getting drained.** |
| 6 | 01 — The flip · "Don't move the asset → Move the signature." | 18.0–23.0s | **Ika flips it. Don't move the asset. Move the *signature*.** |
| 7 | 02 — dWallets · one program → BTC / ETH / SOL / SUI addresses | 23.0–28.6s | **dWallets give your smart contract a native address on Bitcoin, Ethereum, Solana… any chain.** |
| 8 | 03 — 2PC-MPC · You + ⅔ of the network → SIGNED | 28.6–34.0s | **Every signature needs you *and* the network. Nobody signs alone. Not even Ika.** |
| 9 | 04 — Speed · <1s / 10,000 / 100s | 34.0–38.4s | **Sub-second signing. Ten thousand a second. Hundreds of nodes.** |
| 10 | 05 — Build · code + use-case chips | 38.4–43.4s | **Native Bitcoin DeFi. AI agents with real wallets. One program, every chain.** |
| 11 | NO BRIDGES. / NO WRAPPING. / JUST INK. | 43.4–47.6s | **No bridges. *(beat)* No wrapping. *(beat)* Just ink.** |
| 12 | End card · Ika. | 47.6–52.0s | **Ika. Sign anything, on any chain.** |

### Which tagged version to use

ElevenLabs models read different markup, so there are two tagged versions below. Use the one that matches your model:

| Model | Emotion / delivery | Pauses | Pronunciation |
|---|---|---|---|
| **Eleven v3** (recommended, most natural) | Audio tags like `[excited]`, `[deadpan]`, `[laughs]` | `[pause]`, `[short pause]`, `[long pause]`, `…`, line breaks. **No SSML.** | Spell it out (`Eeka`) |
| **Multilingual v2 / Flash v2 / Turbo v2** | None (set with Style slider) | SSML `<break time="0.6s" />` (max 3s) | SSML `<phoneme>`: **Flash v2 & Turbo v2 only** |

Don't paste SSML into v3. It will either read the tags aloud or ignore them. Newer models (v4) also skip SSML breaks, so treat them like v3.

---

### Version A: Eleven v3 (audio tags)

```
[cheerful] gm! I'm Eeka. [short pause] [playful] That's Japanese for… squid.

[warmly] Welcome to Eeka.

[pause]

[conversational] Moving crypto in twenty twenty-six? [short pause] Wrap it. [short pause] Bridge it… [pause] [deadpan] and pray.

[sighs] Billions later… bridges are still getting drained.

[pause]

[confident] Eeka flips it. [short pause] Don't move the asset. [short pause] [emphatic] Move the signature.

[upbeat] Dee-wallets give your smart contract a native address on Bitcoin, Ethereum, Solana… [short pause] any chain.

[matter-of-fact] Every signature needs you… [short pause] and the network. [short pause] Nobody signs alone. [smug] Not even Eeka.

[fast] Sub-second signing. Ten thousand a second. Hundreds of nodes.

[excited] Native Bitcoin DeFi. [short pause] AI agents with real wallets. [short pause] One program, every chain.

[pause]

[punchy] No bridges. [short pause] No wrapping. [pause] [laughs softly] Just ink.

[pause]

[warm, confident] Eeka. [short pause] Sign anything, on any chain.
```

### Version B: SSML (Multilingual v2 / Flash v2 / Turbo v2)

The `<break>` lengths are sized so each line lands on its scene. The `<phoneme>` tags only work on **Flash v2 / Turbo v2**. On Multilingual v2, swap each `<phoneme …>Ika</phoneme>` for plain `Eeka`.

```
gm! I'm <phoneme alphabet="ipa" ph="ˈiːkə">Ika</phoneme>. <break time="0.3s" /> That's Japanese for... <break time="0.2s" /> squid.
<break time="0.5s" />
Welcome to <phoneme alphabet="ipa" ph="ˈiːkə">Ika</phoneme>.
<break time="0.8s" />
Moving crypto in twenty twenty-six? <break time="0.3s" /> Wrap it. <break time="0.3s" /> Bridge it... <break time="0.6s" /> and pray.
<break time="0.7s" />
Billions later, bridges are still getting drained.
<break time="1.0s" />
<phoneme alphabet="ipa" ph="ˈiːkə">Ika</phoneme> flips it. <break time="0.3s" /> Don't move the asset. <break time="0.4s" /> Move the signature.
<break time="0.8s" />
Dee-wallets give your smart contract a native address on Bitcoin, Ethereum, Solana... <break time="0.2s" /> any chain.
<break time="0.6s" />
Every signature needs you <break time="0.2s" /> and the network. <break time="0.3s" /> Nobody signs alone. <break time="0.3s" /> Not even <phoneme alphabet="ipa" ph="ˈiːkə">Ika</phoneme>.
<break time="0.6s" />
Sub-second signing. <break time="0.2s" /> Ten thousand a second. <break time="0.2s" /> Hundreds of nodes.
<break time="0.7s" />
Native Bitcoin DeFi. <break time="0.3s" /> AI agents with real wallets. <break time="0.3s" /> One program, every chain.
<break time="0.8s" />
No bridges. <break time="0.6s" /> No wrapping. <break time="0.7s" /> Just ink.
<break time="1.0s" />
<phoneme alphabet="ipa" ph="ˈiːkə">Ika</phoneme>. <break time="0.4s" /> Sign anything, on any chain.
```

ElevenLabs warns that many `<break>` tags in one generation can cause speed-ups or audio artifacts. If that happens, generate one clip per line (option B under *How to send it back*) and drop the breaks. I'll handle the spacing in the edit.

### Plain text (no tags)

```
gm! I'm Ika. That's Japanese for squid.

Welcome to Ika.

Moving crypto in 2026? Wrap it. Bridge it... and pray.

Billions later, bridges are still getting drained.

Ika flips it. Don't move the asset. Move the signature.

dWallets give your smart contract a native address on Bitcoin, Ethereum, Solana... any chain.

Every signature needs you and the network. Nobody signs alone. Not even Ika.

Sub-second signing. Ten thousand a second. Hundreds of nodes.

Native Bitcoin DeFi. AI agents with real wallets. One program, every chain.

No bridges. No wrapping. Just ink.

Ika. Sign anything, on any chain.
```

---

## Pronunciation (spell it this way in ElevenLabs if the voice slips)

| Word | Say | Phonetic spelling to paste |
|---|---|---|
| Ika | EE-kah | `Eeka` |
| gm | "gee em" | `gee em!` |
| dWallets | "dee-wallets" | `dee-wallets` |
| 2026 | twenty twenty-six | `twenty twenty-six` |
| Sui | "swee" | `Swee` |

## ElevenLabs settings that suit this

- **Model:** Eleven v3 with Version A (best), or Multilingual v2 / Flash v2 with Version B
- **Voice:** young, bright, characterful. Something like *"Charlie"* or *"Jessica"*, or a custom voice with a grin in it
- **Stability ~35–45%** (more expressive) · **Similarity ~75%** · **Style ~30–40%** · Speaker boost **on**
- v3 tags are suggestions. If one sounds forced, delete it or regenerate. v3 varies a lot between takes, so generate 2–3 and keep the best.

## How to send it back

Either works; **option B syncs tightest**:

- **A. One file:** `vo.mp3`, full read with natural pauses between lines.
- **B. One clip per line:** `02.mp3`, `03.mp3` … `12.mp3` (numbers match the table above).

Share it here and I'll re-time every scene to your read, mix it over the sound design, and render the final.
