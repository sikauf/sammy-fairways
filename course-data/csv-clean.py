import csv
import re

with open("Golf Courses-USA.csv", newline="", encoding="utf-8") as infile, \
     open("golf_courses_clean.csv", "w", newline="", encoding="utf-8") as outfile:

    reader = csv.reader(infile)
    writer = csv.writer(outfile)

    # Output header (id first)
    writer.writerow([
        "id",
        "name",
        "city",
        "state",
        "holes",
        "access"
    ])

    skipped = 0
    written = 0
    current_id = 1

    for row in reader:
        # Expect exactly 4 columns
        if len(row) != 4:
            skipped += 1
            continue

        _, _, name_city_state, details = row

        # Must have "Name-City,ST" structure
        if "-" not in name_city_state or "," not in name_city_state:
            skipped += 1
            continue

        try:
            name, city_state = name_city_state.split("-", 1)
            city, state = city_state.rsplit(",", 1)
        except ValueError:
            skipped += 1
            continue

        holes_match = re.search(r"\((\d+)\s+Holes\)", details)
        access_match = re.search(r"\((Public|Municipal|Private)\)", details)

        writer.writerow([
            current_id,
            name.strip(),
            city.strip(),
            state.strip(),
            int(holes_match.group(1)) if holes_match else "",
            access_match.group(1) if access_match else "",
        ])

        current_id += 1
        written += 1

print("Cleaned CSV written to golf_courses_clean.csv")
print(f"Rows written: {written}")
print(f"Rows skipped: {skipped}")
