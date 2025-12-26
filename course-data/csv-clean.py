import csv
import re

with open("Golf Courses-USA.csv", newline="", encoding="utf-8") as infile, \
     open("golf_courses_clean.csv", "w", newline="", encoding="utf-8") as outfile:

    reader = csv.reader(infile)
    writer = csv.writer(outfile)

    writer.writerow([
        "name",
        "city",
        "state",
        "address",
        "latitude",
        "longitude",
        "holes",
        "access",
        "phone"
    ])

    skipped = 0

    for row in reader:
        # Defensive: skip malformed rows
        if len(row) != 4:
            skipped += 1
            continue

        lon, lat, name_city_state, details = row

        # Must contain "-" and ","
        if "-" not in name_city_state or "," not in name_city_state:
            skipped += 1
            continue

        try:
            name, city_state = name_city_state.split("-", 1)
            city, state = city_state.rsplit(",", 1)
        except ValueError:
            skipped += 1
            continue

        holes = re.search(r"\((\d+)\s+Holes\)", details)
        access = re.search(r"\((Public|Municipal|Private)\)", details)
        phone = re.search(r"(\(\d{3}\)\s*\d{3}-\d{4})", details)

        address = re.sub(r"\(.*?\),", "", details)
        address = re.sub(r",\s*\(\d{3}.*", "", address).strip()

        writer.writerow([
            name.strip(),
            city.strip(),
            state.strip(),
            address,
            lat.strip(),
            lon.strip(),
            holes.group(1) if holes else "",
            access.group(1) if access else "",
            phone.group(1) if phone else "",
        ])

print(f"Cleaned CSV written to golf_courses_clean.csv")
print(f"Skipped {skipped} malformed rows")
