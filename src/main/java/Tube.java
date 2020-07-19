
import java.util.Iterator;
import java.util.Stack;

/**
 *
 * @author Antou
 */
public class Tube implements Cloneable {

	private final static Integer TubeSize = 4;
	private Stack<Character> tube = new Stack<>();

	public Boolean push(char b) {
		if (isFull()) {
			return false;
		}
		tube.push(b);
		return true;
	}

	Character top() {
		return tube.peek();
	}

	Character pop() {
		if (isEmpty()) {
			return null;
		}
		Character b = tube.peek();
		tube.pop();
		return b;
	}

	Integer size() {
		return tube.size();
	}

	Boolean isFull() {
		return tube.size() == TubeSize;
	}

	Boolean isHomogenous() {
		if (tube.size() == 0) {
			return true;
		}
		Stack<Character> temp = (Stack<Character>) tube.clone();
		char color = temp.peek();
		temp.pop();
		while (!temp.empty()) {
			if (temp.peek() != color) {
				return false;
			}
			temp.pop();
		}
		return true;
	}

	Boolean isEmpty() {
		return tube.empty();
	}

	void print() {
		Stack<Character> temp = (Stack<Character>) this.tube.clone();
		while (!temp.empty()) {
			System.out.print(temp.pop());
		}
		System.out.println("");
	}

	@Override
	protected Object clone() throws CloneNotSupportedException {
		Tube t = new Tube();
		Iterator<Character> it = this.tube.iterator();
		while (it.hasNext()) {
			t.tube.add(it.next());
		}
		return t;
	}

}
