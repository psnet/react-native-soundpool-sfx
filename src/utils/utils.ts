import {Asset} from 'expo-asset';
import {SoundPoolSFX} from '../SoundPoolSFX';

const ANDROID_BUNDLED_RAW_RESOURCE_PREFIX = 'file:///android_res/raw/';
const ANDROID_FILE_SCHEME = 'file://';
const WEB_URL_PATH_SIGNATURE = 'unstable_path';

/**
 * Universal wrapper around native methods `loadFile` and `loadResource` with usage of `expo-asset` package
 * to determine correct resource/file path on device (bundled in app or updated via OTA from `expo-updates`) or url for web
 */
export async function loadAudioAsset(asset: ReturnType<NodeJS.Require>) {
    const {uri, type, localUri, name} = Asset.fromModule(asset);

    /**
     *
     * Device
     *
     */

    /**
     * resource bundled with app, read directly w/o copy
     */
    if (uri && type && uri.startsWith(ANDROID_BUNDLED_RAW_RESOURCE_PREFIX)) {
        const resourceName = uri
            .replace(ANDROID_BUNDLED_RAW_RESOURCE_PREFIX, '')
            .replace(`.${type}`, '');

        return SoundPoolSFX.loadResource(resourceName);
    }

    /**
     * file transferred via OTA (expo-updates)
     */
    if (localUri && localUri.startsWith(ANDROID_FILE_SCHEME)) {
        return SoundPoolSFX.loadFile(localUri);
    }

    /**
     *
     * Web
     *
     */

    /**
     * file served in web as string
     */
    if (uri && uri.includes(WEB_URL_PATH_SIGNATURE)) {
        return SoundPoolSFX.loadFile(uri);
    }

    throw new Error(`Unknown asset type to load as sound "${name}"`);
}
