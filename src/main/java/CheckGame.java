
import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class CheckGame
 */
@WebServlet("/CheckGame")
public class CheckGame extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Game g;

	/**
	 * @throws IOException
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String game = request.getParameter("game");
		System.out.println(game);
		if (game.startsWith("canMove:")) {
			game = game.substring(8);
			String s[] = game.split(",");
			int i = Integer.parseInt(s[0]);
			int j = Integer.parseInt(s[1]);
			System.out.println(i);
			System.out.println(j);
			if (g.makeMove(i, j)) {
				response.getWriter().write("0");
			} else {
				response.getWriter().write("1"); // error
			}
		} else if (game.equals("")) {
			try {
				if (g.isEnd()) {
					response.getWriter().write("");
					return;
				}
				ArrayList<Pair<Integer, Integer>> res = Solver.iteration_solve_with_heuristic(g);
				response.getWriter().write(res.toString());
				for (Pair<Integer, Integer> p : res) {
					g.makeMove(p.getKey(), p.getValue());
				}
			} catch (CloneNotSupportedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		} else {
			try {
				g = new Game(game);
			} catch (IOException e) {
				response.getWriter().write("1"); // error
				return;
			}
			response.getWriter().write("0");
		}
	}

}
