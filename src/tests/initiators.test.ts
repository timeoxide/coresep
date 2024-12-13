import { LazyInitiator, PreloadedInitiator } from '@/adaptations'
import { ERRORS } from '@/constants/errors.const'
import { Command } from '@/models'
import { expect, test } from 'vitest'

// Test that preloaded initiator works as expected under normal circumstance
test('test preloaded initiator functions as excpected', async () => {

    // define the command
    const command: Command = {
        name: "myCommand",
        meta: {},
        handler(_) { },
    }

    // create the initiator
    const initiator: PreloadedInitiator = new PreloadedInitiator(command);

    // expect the load function to resolve successfully ( even though it actually does nothing )
    await expect(initiator.load()).to.resolves.toBeUndefined();

    // get the result
    const result = initiator.get();

    // expected to be defiend
    expect(result).toBeDefined();

    // expected the to be the same command
    expect(result.name).toBe(command.name);
})


// Test that lazy initiator works as expected under normal circumstance
test('test lazy initiator functions as excpected', async () => {

    // define the importer
    const command: Command = {
        name: "myCommand",
        meta: {},
        handler(_) { },
    };
    const importer: () => Promise<Command> = async () => command;

    // create the initiator
    const initiator: LazyInitiator = new LazyInitiator(importer);

    // make sure load resolves successfully
    await expect(initiator.load()).to.resolves.toBeUndefined();

    // get the command
    const result = initiator.get();

    // make sure the command is defined
    expect(result).toBeDefined();

    // make sure it's the same command
    expect(result.name).toBe(command.name);
})

// Test the behavior of the lazy initiator when the importer throws an error
// it is expected to throw `0x0002 Command Load Failed`.
test('test lazy initiator when importer throws error', async () => {

    // define the importer
    const importer: () => Promise<Command> = async () => { throw new Error(); };

    // create the initiator
    const initiator: LazyInitiator = new LazyInitiator(importer);

    // call load, which is expected to fail to load the command
    await expect(() => initiator.load()).rejects.toThrowError(ERRORS.CommandLoadFailed);
})


// Test the behavior of the lazy initiator when `get` is called before `load` is called
// it is expected to throw `0x0404 Command Not Found`.
test('test lazy initiator when get is called throws error', async () => {

    // define the importer
    const importer: () => Promise<Command> = async () => { throw new Error(); };

    // create the initiator
    const initiator: LazyInitiator = new LazyInitiator(importer);

    // call get before load
    expect(() => initiator.get()).toThrowError(ERRORS.CommandNotFound);
})