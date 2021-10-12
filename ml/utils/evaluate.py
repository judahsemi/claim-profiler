import os
import time
import math
import string
import random

from importlib import reload
from collections import Counter

import nltk
import numpy as np
from matplotlib import pyplot as plt

import torch
from torch import nn
from torch import optim
from torch.functional import F



def keys_to_values(keys, _map, default):
    """
        Converts values in keys to their mapped values in _map. If not found,
        default is used instead.
    """
    return [_map.get(key.rstrip("@@"), default) if key.endswith("@@")\
        else _map.get(key+"</w>", _map.get(key, default)) for key in keys]

