import { errorer } from '@/adaptations'
import { ERRORS } from '@/constants/errors.const'
import { expect, test } from 'vitest'

// Test that all error constants are thrown correctly.
test('all error constants are thrown correctly.', () => {

    // Iterate over each error key in the `ERRORS` object to ensure that all
    // the errors exist in the internal map in default errorer
    Object.entries(ERRORS).forEach(([, errorKey]) => {

        // Expect an error to be thrown with the specified error key.
        expect(() => 
            errorer
                // selects the error by looking it up in an internal map
                .select(errorKey)
                // throws it
                .throw()
            ).toThrowError(errorKey)
    })
});

// Test that the `withContext` method adds context to the thrown error.
test('error context is added to thrown error', () => {

    // the context to add to error
    const text = "added context";

    // run on every error
    Object.entries(ERRORS).forEach(([, errorKey]) => {

        try {
            // throw it
            errorer
                // selects the error
                .select(errorKey)
                // this addes the context to the error stack
                .withContext(text)
                // throws the error
                .throw();

        } catch (error: any) {

            // after catching test the stack to contain the additional context
            // it typically starts with the context
            expect(error.stack).toMatch(text);
        }
    })
})