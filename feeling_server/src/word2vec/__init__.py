import threading
from gensim.models import KeyedVectors


class Word2VecModel:
    _instance_lock = threading.Lock()
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            with cls._instance_lock:
                if cls._instance is None:
                    cls._instance = KeyedVectors.load_word2vec_format(
                        'src/word2vec/sgns.merge.word')
        return cls._instance

    @classmethod
    def init(cls):
        if cls._instance is None:
            with cls._instance_lock:
                if cls._instance is None:
                    cls._instance = KeyedVectors.load_word2vec_format(
                        'src/word2vec/sgns.merge.word')
                    print('Word2Vec model loaded successfully')
