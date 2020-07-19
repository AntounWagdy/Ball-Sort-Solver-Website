/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.PriorityQueue;
import java.util.Set;

class heuristic_struct implements Cloneable, Comparator<heuristic_struct> {

	public Game current;
	public ArrayList<Pair<Integer, Integer>> path;

	public heuristic_struct() {
		path = new ArrayList<>();
	}

	public heuristic_struct(Game current, ArrayList<Pair<Integer, Integer>> path) {
		this.current = current;
		this.path = path;
	}

	@Override
	protected Object clone() throws CloneNotSupportedException {
		ArrayList<Pair<Integer, Integer>> copy = new ArrayList<>();
		for (Pair<Integer, Integer> copy1 : path) {
			copy.add(new Pair(copy1.getKey(), copy1.getValue()));
		}
		return new heuristic_struct((Game) current.clone(), copy);
	}

	@Override
	public int compare(heuristic_struct o1, heuristic_struct o2) {
		return o2.current.getHeuristic().compareTo(o1.current.getHeuristic());
	}
};

/**
 *
 * @author Antou
 */
public class Solver {

	static public ArrayList<Pair<Integer, Integer>> iteration_solve_with_heuristic(Game g)
			throws CloneNotSupportedException {
		Set<Game> visited = new HashSet<>();

		PriorityQueue<heuristic_struct> Qelements = new PriorityQueue<>(100, new heuristic_struct());

		Qelements.add(new heuristic_struct(g, new ArrayList<>()));

		heuristic_struct current;

		heuristic_struct newH = null;

		ArrayList<Pair<Integer, Integer>> moves;
		Boolean found = false;
		while (!found) {
			current = Qelements.poll();
			/*
			 * System.out.print(current.current.getHeuristic());
			 * System.out.println(", "+Qelements.size()); current.current.print();
			 */
			moves = current.current.generateGoodValidMoves();
			for (Pair<Integer, Integer> move : moves) {
				newH = (heuristic_struct) current.clone();
				newH.current.makeMove(move.getKey(), move.getValue());
				newH.path.add(move);

				if (newH.current.isEnd()) {
					found = true;
					break;
				}
				if (!visited.contains(newH.current)) {
					visited.add(newH.current);
					Qelements.add(newH);
				}
			}
		}
		return newH.path;
	}
}
