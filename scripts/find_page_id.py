import json
log_file = r'C:\Users\nvdan\.gemini\antigravity-ide\brain\683f0166-a927-478d-a806-f0eff1d69b93\.system_generated\logs\transcript.jsonl'
with open(log_file, 'r', encoding='utf-8') as f:
    for line in f:
        if 'pages' in line.lower() and 'blogger.com' in line.lower():
            d = json.loads(line)
            for c in d.get('tool_calls', []):
                args_str = str(c.get('args'))
                if 'pages' in args_str:
                    print(f"Step {d.get('step_index')}: {c.get('name')} -> {args_str[:150]}")
