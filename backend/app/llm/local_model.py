from transformers import AutoTokenizer, AutoModelForCausalLM
from transformers import BitsAndBytesConfig, pipeline
import torch


class LocalLLM:
    def __init__(self):

        model_name = "mistralai/Mistral-7B-Instruct-v0.2"

        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_compute_dtype=torch.float16,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_use_double_quant=True,
        )

        self.tokenizer = AutoTokenizer.from_pretrained(model_name)

        self.model = AutoModelForCausalLM.from_pretrained(
            model_name,
            quantization_config=bnb_config,
            device_map="auto"
        )

        self.pipe = pipeline(
            "text-generation",
            model=self.model,
            tokenizer=self.tokenizer,
            max_new_tokens=256,
            temperature=0.1,
            do_sample=False
        )

    def generate(self, prompt: str):
        output = self.pipe(prompt)[0]["generated_text"]
        return output[len(prompt):].strip()
