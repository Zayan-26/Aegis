#This is like 20 times better probably
import re
import sys

def parse_gpx_to_latlng_list(gpx_text):
    matches = re.findall(r'<trkpt lat="([0-9\.\-]+)" lon="([0-9\.\-]+)">', gpx_text)
    return [{'latitude': float(lat), 'longitude': float(lon)} for lat, lon in matches]

def write_latlng_js_array(latlngs, out=sys.stdout):
    print("const points = [", file=out)
    for pt in latlngs:
        print(f"  {{ latitude: {pt['latitude']}, longitude: {pt['longitude']} }},", file=out)
    print("];", file=out)

def main():
    if len(sys.argv) < 2:
        print("Usage: python gpx2latlng.py infile.gpx [outfile.js]", file=sys.stderr)
        sys.exit(1)

    infile = sys.argv[1]
    outfile = sys.argv[2] if len(sys.argv) > 2 else None

    with open(infile, encoding="utf-8") as f:
        gpx = f.read()

    latlngs = parse_gpx_to_latlng_list(gpx)

    if outfile:
        with open(outfile, "w", encoding="utf-8") as out:
            write_latlng_js_array(latlngs, out)
    else:
        write_latlng_js_array(latlngs)

if __name__ == "__main__":
    main()