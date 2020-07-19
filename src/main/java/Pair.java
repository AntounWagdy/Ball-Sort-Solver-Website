
public class Pair<K, V> {
	private K first;
	private V second;

	public Pair(K first, V second) {
		this.first = first;
		this.second = second;
	}

	public K getKey() {
		return first;
	}

	public V getValue() {
		return second;
	}
	@Override
	public String toString() {
		return first+"="+second;
	}

}