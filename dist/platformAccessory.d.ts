import { PlatformAccessory, CharacteristicValue } from 'homebridge';
import { SomfyRTSHomebridgePlatform } from './platform';
/**
 * Platform Accessory
 */
export declare class SomfyRTSPlatformAccessory {
    private readonly platform;
    private readonly accessory;
    private service;
    private api;
    private name;
    private state;
    constructor(platform: SomfyRTSHomebridgePlatform, accessory: PlatformAccessory);
    handleCurrentPositionGet(): Promise<CharacteristicValue>;
    handlePositionStateGet(): Promise<CharacteristicValue>;
    handleTargetPositionGet(): Promise<CharacteristicValue>;
    handleTargetPositionSet(value: CharacteristicValue): Promise<void>;
    setPosition(value: CharacteristicValue): Promise<void>;
}
//# sourceMappingURL=platformAccessory.d.ts.map