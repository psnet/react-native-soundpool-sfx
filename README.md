# React Native SoundPool SFX

Android and web short sounds **audio player** with **low-latency** with TS API, zero-copy input and **zero dependencies**.

Target
---

**React Native** >= 0.81.5 with Hermes.

Works with **Expo**.

Installation
---

```
npm i https://github.com/psnet/react-native-soundpool-sfx
```

API
---

```ts
import * as SoundPoolSFX from 'react-native-soundpool-sfx';
```
Full list of methods described in [`src/index.ts`](https://github.com/psnet/react-native-soundpool-sfx/blob/main/src/index.ts)

Features
---

- **Low-latency**: preloads and decodes audio into memory for start playing quickly. Best for UI effects, transitions, game sound effects
- **Zero-copy input**: reads bundled with app resources or files from FS directly w/o copying
- **Zero dependencies**
- **Small size**
- **TypeScript** API for RN
