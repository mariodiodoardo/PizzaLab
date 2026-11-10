import unittest
from model import GRID, hours, log_interpolate, progress, solve, REF, TEST
class ModelTests(unittest.TestCase):
    def test_anchor(self):
        for t in GRID:
            self.assertAlmostEqual(hours(t,log_interpolate(t)),48,places=7)
    def test_monotonic_yeast(self):
        for t in GRID:
            self.assertGreater(hours(t,.1),hours(t,.2))
    def test_reference_close(self):
        self.assertTrue(2.8<solve(REF)*964/100<3.5)
    def test_second_dose(self):
        self.assertTrue(3.3<solve(TEST)*963/100<4.3)
    def test_progress_target(self):
        self.assertAlmostEqual(progress(REF,solve(REF)),1,places=7)
    def test_bounds(self):
        with self.assertRaises(ValueError):hours(30,.2)
if __name__=='__main__':unittest.main()
