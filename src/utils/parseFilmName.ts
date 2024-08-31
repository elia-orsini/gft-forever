export default function parseFilmName(filmName: string): string {
  filmName = filmName.toLowerCase();

  filmName = filmName.replace("preview: ", "");
  filmName = filmName.replace("+ q&a", "");
  filmName = filmName.replace(" (subtitled)", "");
  filmName = filmName.replace(" (dubbed)", "");
  filmName = filmName.replace(/\(.*\)/, "");
  filmName = filmName.replace(/\-.*th anniversary/, "");

  return filmName;
}
