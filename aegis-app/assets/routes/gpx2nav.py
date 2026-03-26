import xml.etree.ElementTree as ET

def gpx_to_js(gpx_filename, js_filename):
    # Parse XML
    tree = ET.parse(gpx_filename)
    root = tree.getroot()
    ns = {'gpx': 'http://www.topografix.com/GPX/1/1'}

    # Build array of nav nodes
    navnodes = []
    for rtept in root.findall('.//gpx:rtept', ns):
        lat = float(rtept.attrib['lat'])
        lng = float(rtept.attrib['lon'])
        desc_elem = rtept.find('gpx:desc', ns)
        directions = desc_elem.text.replace("'", "\\'") if desc_elem is not None and desc_elem.text else ''
        navnodes.append(
            f"  {{ coordinates: {{ lat: {lat}, lng: {lng} }}, directions: '{directions}' }}"
        )

    # Write JS output
    with open(js_filename, 'w', encoding='utf-8') as fout:
        fout.write("// Auto-generated from GPX\n")
        fout.write("// eslint-disable\n\n")
        fout.write("export default [\n")
        fout.write(",\n".join(navnodes))
        fout.write("\n];\n")

if __name__ == "__main__":
    # Change these to your actual file paths if needed
    gpx_to_js("GraphHopper-Track-2026-03-23-5km_0.gpx", "navnodes.js")
    print("Done: navnodes.js written.")