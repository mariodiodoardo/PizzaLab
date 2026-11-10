import unittest
from piecewise import hours_piecewise,progress,solve
from model import GRID,REF
class PiecewiseTests(unittest.TestCase):
    def test_selected_grid_cells(self):
        for t,cells in GRID.items():
            for dose,observed in cells.items():
                self.assertAlmostEqual(hours_piecewise(t,dose),observed,places=6)
    def test_48h_anchor(self):
        from model import log_interpolate
        for t in GRID:
            self.assertAlmostEqual(hours_piecewise(t,log_interpolate(t)),48,places=6)
    def test_monotonic(self):
        for t in [4,10,15,20,22,25]:
            self.assertGreater(hours_piecewise(t,.05),hours_piecewise(t,.1))
    def test_progress_solve(self):
        self.assertAlmostEqual(progress(REF,solve(REF)),1,places=6)
if __name__=='__main__':unittest.main()
