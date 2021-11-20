"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SomfyRTSHomebridgePlatform = void 0;
const settings_1 = require("./settings");
const platformAccessory_1 = require("./platformAccessory");
/**
 * HomebridgePlatform
 */
class SomfyRTSHomebridgePlatform {
    constructor(log, config, api) {
        this.log = log;
        this.config = config;
        this.api = api;
        this.Service = this.api.hap.Service;
        this.Characteristic = this.api.hap.Characteristic;
        // this is used to track restored cached accessories
        this.accessories = [];
        this.log.debug('Finished initializing platform:', this.config.name);
        // When this event is fired it means Homebridge has restored all cached accessories from disk.
        // Dynamic Platform plugins should only register new accessories after this event was fired,
        // in order to ensure they weren't added to homebridge already. This event can also be used
        // to start discovery of new accessories.
        this.api.on('didFinishLaunching', () => {
            log.debug('Executed didFinishLaunching callback');
            this.discoverDevices();
        });
    }
    /**
     * This function is invoked when homebridge restores cached accessories from disk at startup.
     * It should be used to setup event handlers for characteristics and update respective values.
     */
    configureAccessory(accessory) {
        this.log.info('Loading accessory from cache:', accessory.displayName);
        // add the restored accessory to the accessories cache so we can track if it has already been registered
        this.accessories.push(accessory);
    }
    /**
     * Discover devices from config
     */
    discoverDevices() {
        const devices = this.config.devices;
        // loop over the discovered devices and register each one if it has not already been registered
        for (const device of devices) {
            const uuid = this.api.hap.uuid.generate(device.id);
            // see if an accessory with the same uuid has already been registered and restored from
            // the cached devices we stored in the `configureAccessory` method above
            const existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid);
            if (existingAccessory) {
                // the accessory already exists
                this.log.info('Restoring existing accessory from cache:', existingAccessory.displayName);
                // Update config
                existingAccessory.context.device = device;
                this.api.updatePlatformAccessories([existingAccessory]);
                new platformAccessory_1.SomfyRTSPlatformAccessory(this, existingAccessory);
                // it is possible to remove platform accessories at any time using `api.unregisterPlatformAccessories`, eg.:
                // remove platform accessories when no longer present
                // this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [existingAccessory]);
                // this.log.info('Removing existing accessory from cache:', existingAccessory.displayName);
            }
            else {
                // the accessory does not yet exist, so we need to create it
                this.log.info('Adding new accessory:', device.name);
                // create a new accessory
                const accessory = new this.api.platformAccessory(device.name, uuid);
                // store a copy of the device object in the `accessory.context`
                accessory.context.device = device;
                new platformAccessory_1.SomfyRTSPlatformAccessory(this, accessory);
                this.api.registerPlatformAccessories(settings_1.PLUGIN_NAME, settings_1.PLATFORM_NAME, [accessory]);
            }
        }
    }
}
exports.SomfyRTSHomebridgePlatform = SomfyRTSHomebridgePlatform;
//# sourceMappingURL=platform.js.map