import os
import re

admin_dir = "/home/mohammad-abdul-hakim/Desktop/VibeCoding/a2icoders/src/app/[locale]/admin"
features_dir = "/home/mohammad-abdul-hakim/Desktop/VibeCoding/a2icoders/src/features"

print("Scanning admin pages...")
for item in sorted(os.listdir(admin_dir)):
    item_path = os.path.join(admin_dir, item)
    if os.path.isdir(item_path):
        page_path = os.path.join(item_path, "page.tsx")
        if os.path.exists(page_path):
            with open(page_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Find filter keys
            filters = []
            # Look for keys inside filters list
            # Match: key: "status" or key: 'status'
            filter_keys = re.findall(r'key:\s*["\']([^"\']+)["\']', content)
            
            # Find searchKey
            search_key_match = re.search(r'searchKey=\s*["\']([^"\']+)["\']', content)
            search_key = search_key_match.group(1) if search_key_match else None
            
            # Find if page has searchValue
            has_search_val = "searchValue=" in content
            
            # Find features import
            # e.g., import { ... } from "@/features/about";
            feature_match = re.search(r'@/features/([a-zA-Z0-9\-]+)', content)
            feature_name = feature_match.group(1) if feature_match else None
            
            print(f"\nFeature: {item}")
            print(f"  Page: {page_path}")
            print(f"  Search Key: {search_key} (Controlled: {has_search_val})")
            print(f"  Filter Keys: {filter_keys}")
            print(f"  Feature Name: {feature_name}")
            
            if feature_name:
                schema_path = os.path.join(features_dir, feature_name, "schemas", f"{feature_name}.schema.ts")
                if os.path.exists(schema_path):
                    with open(schema_path, 'r', encoding='utf-8') as sf:
                        s_content = sf.read()
                    
                    # Find query schema name
                    # e.g., export const AboutQuerySchema
                    query_schema_match = re.search(r'export\s+const\s+([a-zA-Z0-9_]+QuerySchema)', s_content)
                    if query_schema_match:
                        qs_name = query_schema_match.group(1)
                        # Extract the fields inside z.object({...})
                        # Look for z.object({ ... })
                        obj_match = re.search(qs_name + r'\s*=\s*z\.object\(\{(.*?)\}\)', s_content, re.DOTALL)
                        if obj_match:
                            fields = re.findall(r'([a-zA-Z0-9_]+)\s*:', obj_match.group(1))
                            print(f"  Zod Schema Fields: {fields}")
                        else:
                            print(f"  Zod Schema found but could not parse object fields.")
                    else:
                        print(f"  No QuerySchema found in {schema_path}")
                else:
                    print(f"  No schema file at {schema_path}")
