import {SoundPoolSFX} from './SoundPoolSFX';
import {loadAudioAsset} from './utils/utils';

/**
 * Inits sound pool with maximum streams to play
 */
export const initialize = async (maxStreams = 16): Promise<void> => SoundPoolSFX.initialize(maxStreams);

/**
 * Loads file from FS, decodes into memory and returns sound `id`
 */
export const loadFile = async (path: string): Promise<number> => SoundPoolSFX.loadFile(path);

/**
 * Loads bundled resource from app, decodes into memory and returns sound `id`
 */
export const loadResource = async (name: string): Promise<number> => SoundPoolSFX.loadResource(name);

/**
 * Plays sound by `id` with `volume`
 */
export const play = (id: number, volume = 1): void => SoundPoolSFX.play(id, volume);

/**
 * Unloads sound by `id` from memory and free resources from it
 */
export const unload = (id: number): void => SoundPoolSFX.unload(id);

/**
 * Unloads all sounds from memory and frees resources
 */
export const release = (): void => SoundPoolSFX.release();

/**
 * Loads audio, decodes into memory and returns sound `id`
 *
 * This is universal wrapper around native methods `loadFile` and `loadResource` with usage of `expo-asset` package
 * to determine correct resource (bundled in app) or file path (updated via OTA from `expo-updates`) on device or url for web
 */
export const loadAudio = async (asset: ReturnType<NodeJS.Require>): Promise<number> => loadAudioAsset(asset);
