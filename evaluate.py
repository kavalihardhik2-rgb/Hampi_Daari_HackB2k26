import json
from pathlib import Path
from hampi.guide import ask, check

# Run evaluation on test set and print metrics
def main():
    eval_file = Path(__file__).parent / "tests" / "eval_set.json"
    with open(eval_file, "r", encoding="utf-8") as f:
        items = json.load(f)

    correct = 0
    wrong = 0
    correct_refusals = 0

    for item in items:
        itype = item["type"]
        text = item["text"]
        expect = item["expect"]

        if itype == "ask":
            res = ask(text)
            if expect == "refuse":
                if not res.get("found"):
                    correct_refusals += 1
                else:
                    wrong += 1
            else:
                top_site = res["answers"][0]["site"] if res.get("answers") else None
                if res.get("found") and (res.get("site") == expect or top_site == expect):
                    correct += 1
                else:
                    wrong += 1
        elif itype == "check":
            res = check(text)
            if expect == "refuse":
                if not res.get("matched"):
                    correct_refusals += 1
                else:
                    wrong += 1
            else:
                if res.get("matched") and res.get("verdict") == expect:
                    correct += 1
                else:
                    wrong += 1

    total = len(items)
    print(f"{'Category':<20} {'Count':>8} {'Percentage':>12}")
    print("-" * 42)
    print(f"{'Correct':<20} {correct:>8} {correct / total * 100:>11.1f}%")
    print(f"{'Wrong':<20} {wrong:>8} {wrong / total * 100:>11.1f}%")
    print(f"{'Correct refusals':<20} {correct_refusals:>8} {correct_refusals / total * 100:>11.1f}%")
    print("-" * 42)
    print(f"{'Total':<20} {total:>8} {100.0:>11.1f}%")

if __name__ == "__main__":
    main()

