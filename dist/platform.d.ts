import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig, Service, Characteristic } from 'homebridge';
/**
 * HomebridgePlatform
 */
export declare class SomfyRTSHomebridgePlatform implements DynamicPlatformPlugin {
    readonly log: Logger;
    readonly config: PlatformConfig;
    readonly api: API;
    readonly Service: typeof Service;
    readonly Characteristic: typeof Characteristic;
    readonly accessories: PlatformAccessory[];
    constructor(log: Logger, config: PlatformConfig, api: API);
    /**
     * This function is invoked when homebridge restores cached accessories from disk at startup.
     * It should be used to setup event handlers for characteristics and update respective values.
     */
    configureAccessory(accessory: PlatformAccessory): void;
    /**
     * Discover devices from config
     */
    discoverDevices(): void;
}
//# sourceMappingURL=platform.d.ts.map