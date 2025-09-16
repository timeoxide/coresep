import { IGracefulMap } from "@/abstractions/graceful-map.abstraction";
import { errorer } from "./errorer.default";
import { ERRORS } from "@/constants/errors.const";

/**
 * GracefulMap is a Map extension that prevents overwriting existing keys with Set,
 * and provides an Update method for atomic updates or initialization with a default value.
 * Throws a clear error if attempting to set a key that already exists.
 *
 * @template K - The type of keys.
 * @template V - The type of values.
 */
export class GracefulMap<K, V> extends Map<K, V> implements IGracefulMap<K, V> {
  /**
   * Creates a new GracefulMap instance.
   * @param name The name of the map (used in error messages).
   */
  constructor(private name: string = "the Map") {
    super();
  }

  /**
   * Sets a value for a key. Throws if the key already exists.
   * @param key The key to set
   * @param value The value to set
   * @throws {GracefulMapKeyExistsError} If the key already exists in the map.
   * @returns this
   */
  set(key: K, value: V): this {
    if (this.has(key)) {
      errorer
        .select(ERRORS.KeyExistsInMap)
        .withContext(
          `cannot set '${String(key)}' because it already exists in '${
            this.name
          }'`
        )
        .throw();
    }
    super.set(key, value);
    return this;
  }

  /**
   * Updates a value for a key using a callback. If the key does not exist, uses the default value.
   * @param key The key to update
   * @param updater A callback that receives the current value (or defaultValue) and returns the new value
   * @param defaultValue The value to use if the key does not exist
   * @returns this
   */
  update(key: K, updater: (current: V) => V, defaultValue: V): this {
    const current = this.has(key) ? this.get(key)! : defaultValue;
    const updated = updater(current);
    super.set(key, updated);
    return this;
  }
}
