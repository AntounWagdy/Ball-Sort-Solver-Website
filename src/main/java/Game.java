
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Objects;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Antou
 */
public class Game implements Cloneable {

	final private ArrayList<Tube> tubes = new ArrayList<>();
	private Long hash;
	static private Integer p = 31;
	static private Integer m = 1000000001;
	private int heuristic;

	public Game() {
	}

	@Override
	public Game clone() throws CloneNotSupportedException {
		Game g = new Game();
		g.hash = hash;
		for (Tube tube : tubes) {
			g.tubes.add((Tube) tube.clone());
		}
		calculateHeuristic();
		return g;
	}

	public Game(String filename) throws FileNotFoundException, IOException {
		File file = new File(filename);
		BufferedReader br = new BufferedReader(new FileReader(file));
		long p_pow = 1;
		hash = 0l;
		ArrayList<Integer> Counters = new ArrayList<>();
		for (int i = 0; i < 255; i++) {
			Counters.add(i, 0);
		}
		int num;
		String line;
		int ind = 0;

		line = br.readLine();
		num = Integer.parseInt(line);
		for (int i = 0; i < num; i++) {
			tubes.add(new Tube());
		}
		Character temp;
		while ((line = br.readLine()) != null) {
			for (int i = 0; i < line.length(); i++) {
				temp = line.charAt(i);
				temp = Character.toUpperCase(temp);
				tubes.get(ind).push(temp);
				Counters.set(temp, Counters.get(temp) + 1);
				hash = (hash + (temp - 'A' - 1) * p_pow) % m;
				p_pow = (p_pow * p) % m;
			}
			ind++;
		}
		for (int i = 0; i < 255; i++) {
			if (Counters.get(i) != 0 && Counters.get(i) != 4) {
				throw new IOException("Invalid input file.");
			}
		}
		try {
			calculateHeuristic();
		} catch (CloneNotSupportedException ex) {
			Logger.getLogger(Game.class.getName()).log(Level.SEVERE, null, ex);
		}
	}

	Boolean isValidMove(int s, int e) {
		if (s < 0 || e < 0 || s >= tubes.size() || e >= tubes.size()) {
			return false;
		}
		if (!tubes.get(s).isEmpty()) {
			if (tubes.get(e).isEmpty()) {
				return true;
			}
			if (tubes.get(e).isFull()) {
				return false;
			}
			if (tubes.get(s).top() == tubes.get(e).top()) {
				return true;
			}
		}
		return false;
	}

	Boolean makeMove(int s, int e) {
		if (!isValidMove(s, e)) {
			return false;
		}
		// hashing variables
		long p_pow = 1;

		// remove the moving charcter from the hash
		// p_pow ^ index of the charcter
		for (int i = 0; i < s * 4 + tubes.get(s).size(); i++) {
			p_pow = (p_pow * p) % m;
		}
		hash = (hash - (tubes.get(s).top() - 'A' + 1) * p_pow) % m;
		hash = (hash + m) % m;

		p_pow = 1;
		// add the moving charcter to the hash with the new value
		// p_pow ^ index of the charcter
		for (int i = 0; i < e * 4 + tubes.get(e).size() + 1; i++) {
			p_pow = (p_pow * p) % m;
		}
		hash = (hash + (tubes.get(s).top() - 'A' + 1) * p_pow) % m;

		Character b = 'a';
		b = tubes.get(s).pop();
		tubes.get(e).push(b);
		try {
			calculateHeuristic();
		} catch (CloneNotSupportedException ex) {
			Logger.getLogger(Game.class.getName()).log(Level.SEVERE, null, ex);
		}
		return true;
	}

	Boolean isEnd() {
		for (int i = 0; i < tubes.size(); i++) {
			if ((!tubes.get(i).isFull() || !tubes.get(i).isHomogenous()) && !tubes.get(i).isEmpty()) {
				return false;
			}
		}
		return true;
	}

	int getNumTubes() {
		return tubes.size();
	}

	ArrayList<Pair<Integer, Integer>> generateGoodValidMoves() {
		ArrayList<Pair<Integer, Integer>> vec = new ArrayList<>();
		Boolean isH1, isH2;

		for (int i = 0; i < tubes.size(); i++) {
			for (int j = 0; j < tubes.size(); j++) {
				isH1 = tubes.get(i).isHomogenous();
				isH2 = tubes.get(j).isHomogenous();

				// by adding the condition after the first condition, we generate only the good
				// moves
				if (i != j && isValidMove(i, j) && // check if valid move
						!(isH1 && tubes.get(j).isEmpty())
						&& !(isH1 && isH2 && tubes.get(i).size() > tubes.get(j).size())
						&& !(tubes.get(i).isFull() && isH1) // don't move from full and homogenous tube
				) {
					vec.add(new Pair<>(i, j));
				}
			}
		}
		return vec;
	}

	long getHash() {
		return hash;
	}

	void calculateHeuristic() throws CloneNotSupportedException {
		int score = 0;
		Tube temp;
		char c2 = 0, c1 = 0;
		int cnt = 1;
		for (int i = 0; i < tubes.size(); i++) {
			if (tubes.get(i).isEmpty()) {
				score += 10;
			} else {
				temp = (Tube) tubes.get(i).clone();
				c1 = temp.pop();
				cnt = 1;
				while (!temp.isEmpty()) {
					c2 = temp.pop();
					if (c1 == c2) {
						cnt++;
					} else {
						c1 = c2;
						cnt = 1;
					}
				}
				score += (5 * cnt);
			}
		}
		heuristic = score;
	}

	@Override
	public int hashCode() {
		return hash.intValue();
	}

	@Override
	public boolean equals(Object obj) {
		if (obj == null) {
			return false;
		}
		if (getClass() != obj.getClass()) {
			return false;
		}
		final Game other = (Game) obj;
		return Objects.equals(this.hash, other.hash);
	}

	void print() {
		for (Tube tube : tubes) {
			tube.print();
		}
	}

	Integer getHeuristic() {
		return heuristic;
	}
}
