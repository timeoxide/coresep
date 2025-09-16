/**
 * An immutable map interface that throws if a key is set more than once.
 */
export interface IGracefulMap<K, V> extends Map<K, V> {
	/**
	 * Sets a value for a key. Throws if the key already exists.
	 * @param key The key to set
	 * @param value The value to set
	 * @param name The name of the map (for error messages)
	 */
	set(key: K, value: V): this;

	/**
	 * Updates a value for a key using a callback. If the key does not exist, uses the default value.
	 * @param key The key to update
	 * @param updater A callback that receives the current value (or defaultValue) and returns the new value
	 * @param defaultValue The value to use if the key does not exist
	 * @returns this
	 */
	update(key: K, updater: (current: V) => V, defaultValue: V): this;
}
