import threading
from gensim.models import Word2Vec


class Word2VecModel:
    _instance_lock = threading.Lock()
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            with cls._instance_lock:
                if cls._instance is None:
                    cls._instance = Word2Vec.load(
                        'src/word2vec/word2vec.model')
        return cls._instance

    @classmethod
    def init(cls):
        if cls._instance is None:
            with cls._instance_lock:
                if cls._instance is None:
                    cls._instance = Word2Vec.load(
                        'src/word2vec/word2vec.model')
                    print('Word2Vec model loaded successfully')
