from typing import Dict


class Measurement:
    def __init__(self, name: str, value: Dict[str, int]):
        """ Experiment measurement.

        Args:
            name (str): name of measurement
            value (dict): value of measurement
        """
        self.name = name
        self.value = value

    def __dict__(self):
        return {
            "name": self.name,
            "value": self.value
        }

    def __eq__(self, other: 'Measurement'):
        return self.name == other.name and self.value == other.value

    def __repr__(self):
        return "Measurement({}: {})".format(self.name, self.value)