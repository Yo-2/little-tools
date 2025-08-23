// This file imports the CSS for all the fonts used in the application.
// It also exports categorized lists of the available font families.

export interface Font {
	label: string;
	value: string;
}

export interface FontCategory {
	name: string;
	fonts: Font[];
}

// CJK Fonts
import '@fontsource/noto-sans-sc';
import '@fontsource/noto-serif-sc';
import '@fontsource/noto-sans-tc';
import '@fontsource/noto-serif-tc';
import '@fontsource/noto-sans-jp';
import '@fontsource/noto-serif-jp';
import '@fontsource/noto-sans-kr';
import '@fontsource/noto-serif-kr';
import '@fontsource/lxgw-wenkai-tc';
import '@fontsource/ma-shan-zheng';
import '@fontsource/long-cang';
import '@fontsource/zcool-xiaowei';
import '@fontsource/zcool-qingke-huangyou';
import '@fontsource/m-plus-1p';
import '@fontsource/m-plus-rounded-1c';
import '@fontsource/sawarabi-mincho';
import '@fontsource/sawarabi-gothic';
import '@fontsource/nanum-myeongjo';
import '@fontsource/nanum-gothic';
import '@fontsource/nanum-pen-script';
import '@fontsource/black-han-sans';
import '@fontsource/gaegu';
import '@fontsource/gamja-flower';
import '@fontsource/gothic-a1';
import '@fontsource/gowun-batang';
import '@fontsource/hina-mincho';
import '@fontsource/kaisei-decol';
import '@fontsource/klee-one';
import '@fontsource/yusei-magic';
import '@fontsource/zen-kaku-gothic-new';
import '@fontsource/zen-maru-gothic';
import '@fontsource/zen-old-mincho';

// Specialty Fonts
import '@fontsource/orbitron';
import '@fontsource/press-start-2p';
import '@fontsource/vt323';
import '@fontsource/black-ops-one';
import '@fontsource/bungee';
import '@fontsource/creepster';
import '@fontsource/lobster';
import '@fontsource/pacifico';
import '@fontsource/dancing-script';
import '@fontsource/shadows-into-light';
import '@fontsource/permanent-marker';
import '@fontsource/bangers';
import '@fontsource/ruslan-display';
import '@fontsource/unifrakturmaguntia';
import '@fontsource/abril-fatface';
import '@fontsource/alfa-slab-one';
import '@fontsource/monoton';
import '@fontsource/ultra';
import '@fontsource/jetbrains-mono';
import '@fontsource/fira-code';
import '@fontsource/major-mono-display';
import '@fontsource/pixelify-sans';
import '@fontsource/silkscreen';
import '@fontsource/redacted-script';
import '@fontsource/geist-mono';
import '@fontsource/comic-mono';
import '@fontsource/cascadia-code';
import '@fontsource/victor-mono';
import '@fontsource/syne-mono';
import '@fontsource/rubik-doodle-shadow';
import '@fontsource/rubik-glitch';
import '@fontsource/rubik-pixels';
import '@fontsource/honk';
import '@fontsource/space-mono';
import '@fontsource/inconsolata';
import '@fontsource/azeret-mono';
import '@fontsource/bricolage-grotesque';

// General Sans-Serif
import '@fontsource/dm-sans';
import '@fontsource/inter';
import '@fontsource/work-sans';
import '@fontsource/libre-franklin';
import '@fontsource/fira-sans';
import '@fontsource/alegreya-sans';
import '@fontsource/source-sans-pro';
import '@fontsource/roboto';
import '@fontsource/poppins';
import '@fontsource/archivo-narrow';
import '@fontsource/karla';
import '@fontsource/proza-libre';
import '@fontsource/ibm-plex-sans';
import '@fontsource/manrope';
import '@fontsource/montserrat';
import '@fontsource/lato';
import '@fontsource/pt-sans';
import '@fontsource/chivo';
import '@fontsource/rubik';
import '@fontsource/open-sans';
import '@fontsource/raleway';
import '@fontsource/overpass';
import '@fontsource/josefin-sans';
import '@fontsource/varela-round';
import '@fontsource/rajdhani';
import '@fontsource/nunito-sans';
import '@fontsource/instrument-sans';
import '@fontsource/plus-jakarta-sans';
import '@fontsource/spartan';
import '@fontsource/outfit';
import '@fontsource/syne';
import '@fontsource/familjen-grotesk';
import '@fontsource/albert-sans';
import '@fontsource/arimo';
import '@fontsource/asap';
import '@fontsource/barlow';
import '@fontsource/cabin';
import '@fontsource/cairo';
import '@fontsource/dosis';
import '@fontsource/exo-2';
import '@fontsource/figtree';
import '@fontsource/hind';
import '@fontsource/jost';
import '@fontsource/kanit';
import '@fontsource/lexend';
import '@fontsource/mulish';
import '@fontsource/oswald';
import '@fontsource/quicksand';
import '@fontsource/signika';
import '@fontsource/sora';
import '@fontsource/urbanist';

// General Serif
import '@fontsource/cormorant';
import '@fontsource/eczar';
import '@fontsource/alegreya';
import '@fontsource/source-serif-pro';
import '@fontsource/fraunces';
import '@fontsource/inknut-antiqua';
import '@fontsource/libre-baskerville';
import '@fontsource/playfair-display';
import '@fontsource/lora';
import '@fontsource/spectral';
import '@fontsource/pt-serif';
import '@fontsource/cardo';
import '@fontsource/neuton';
import '@fontsource/merriweather';
import '@fontsource/zilla-slab';
import '@fontsource/josefin-slab';
import '@fontsource/old-standard-tt';
import '@fontsource/bitter';
import '@fontsource/instrument-serif';
import '@fontsource/roboto-serif';
import '@fontsource/newsreader';
import '@fontsource/dm-serif-text';
import '@fontsource/dm-serif-display';
import '@fontsource/literata';
import '@fontsource/biorhyme';
import '@fontsource/gentium-basic';
import '@fontsource/arvo';
import '@fontsource/domine';
import '@fontsource/eb-garamond';
import '@fontsource/faustina';
import '@fontsource/merriweather-sans';
import '@fontsource/noto-serif';
import '@fontsource/vollkorn';


const cjkFonts: Font[] = [
	{ label: '[CJK] Noto Sans SC', value: 'Noto Sans SC' },
	{ label: '[CJK] Noto Serif SC', value: 'Noto Serif SC' },
	{ label: '[CJK] Noto Sans TC', value: 'Noto Sans TC' },
	{ label: '[CJK] Noto Serif TC', value: 'Noto Serif TC' },
	{ label: '[CJK] Noto Sans JP', value: 'Noto Sans JP' },
	{ label: '[CJK] Noto Serif JP', value: 'Noto Serif JP' },
	{ label: '[CJK] Noto Sans KR', value: 'Noto Sans KR' },
	{ label: '[CJK] Noto Serif KR', value: 'Noto Serif KR' },
	{ label: '[CJK] LXGW WenKai TC', value: 'LXGW WenKai TC' },
	{ label: '[CJK] Ma Shan Zheng', value: 'Ma Shan Zheng' },
	{ label: '[CJK] Long Cang', value: 'Long Cang' },
	{ label: '[CJK] ZCOOL XiaoWei', value: 'ZCOOL XiaoWei' },
	{ label: '[CJK] ZCOOL QingKe HuangYou', value: 'ZCOOL QingKe HuangYou' },
	{ label: '[CJK] M PLUS 1p', value: 'M PLUS 1p' },
	{ label: '[CJK] M PLUS Rounded 1c', value: 'M PLUS Rounded 1c' },
	{ label: '[CJK] Sawarabi Mincho', value: 'Sawarabi Mincho' },
	{ label: '[CJK] Sawarabi Gothic', value: 'Sawarabi Gothic' },
	{ label: '[CJK] Nanum Myeongjo', value: 'Nanum Myeongjo' },
	{ label: '[CJK] Nanum Gothic', value: 'Nanum Gothic' },
	{ label: '[CJK] Nanum Pen Script', value: 'Nanum Pen Script' },
	{ label: '[CJK] Black Han Sans', value: 'Black Han Sans' },
	{ label: '[CJK] Gaegu', value: 'Gaegu' },
	{ label: '[CJK] Gamja Flower', value: 'Gamja Flower' },
	{ label: '[CJK] Gothic A1', value: 'Gothic A1' },
	{ label: '[CJK] Gowun Batang', value: 'Gowun Batang' },
	{ label: '[CJK] Hina Mincho', value: 'Hina Mincho' },
	{ label: '[CJK] Kaisei Decol', value: 'Kaisei Decol' },
	{ label: '[CJK] Klee One', value: 'Klee One' },
	{ label: '[CJK] Yusei Magic', value: 'Yusei Magic' },
	{ label: '[CJK] Zen Kaku Gothic New', value: 'Zen Kaku Gothic New' },
	{ label: '[CJK] Zen Maru Gothic', value: 'Zen Maru Gothic' },
	{ label: '[CJK] Zen Old Mincho', value: 'Zen Old Mincho' },
];

const specialtyFonts: Font[] = [
	{ label: '[Special] Orbitron', value: 'Orbitron' },
	{ label: '[Special] Press Start 2P', value: 'Press Start 2P' },
	{ label: '[Special] VT323', value: 'VT323' },
	{ label: '[Special] Black Ops One', value: 'Black Ops One' },
	{ label: '[Special] Bungee', value: 'Bungee' },
	{ label: '[Special] Creepster', value: 'Creepster' },
	{ label: '[Special] Lobster', value: 'Lobster' },
	{ label: '[Special] Pacifico', value: 'Pacifico' },
	{ label: '[Special] Dancing Script', value: 'Dancing Script' },
	{ label: '[Special] Shadows Into Light', value: 'Shadows Into Light' },
	{ label: '[Special] Permanent Marker', value: 'Permanent Marker' },
	{ label: '[Special] Bangers', value: 'Bangers' },
	{ label: '[Special] Ruslan Display', value: 'Ruslan Display' },
	{ label: '[Special] UnifrakturMaguntia', value: 'UnifrakturMaguntia' },
	{ label: '[Special] Abril Fatface', value: 'Abril Fatface' },
	{ label: '[Special] Alfa Slab One', value: 'Alfa Slab One' },
	{ label: '[Special] Monoton', value: 'Monoton' },
	{ label: '[Special] Ultra', value: 'Ultra' },
	{ label: '[Special] JetBrains Mono', value: 'JetBrains Mono' },
	{ label: '[Special] Fira Code', value: 'Fira Code' },
	{ label: '[Special] Major Mono Display', value: 'Major Mono Display' },
	{ label: '[Special] Pixelify Sans', value: 'Pixelify Sans' },
	{ label: '[Special] Silkscreen', value: 'Silkscreen' },
	{ label: '[Special] Redacted Script', value: 'Redacted Script' },
	{ label: '[Special] Geist Mono', value: 'Geist Mono' },
	{ label: '[Special] Comic Mono', value: 'Comic Mono' },
	{ label: '[Special] Cascadia Code', value: 'Cascadia Code' },
	{ label: '[Special] Victor Mono', value: 'Victor Mono' },
	{ label: '[Special] Syne Mono', value: 'Syne Mono' },
	{ label: '[Special] Rubik Doodle Shadow', value: 'Rubik Doodle Shadow' },
	{ label: '[Special] Rubik Glitch', value: 'Rubik Glitch' },
	{ label: '[Special] Rubik Pixels', value: 'Rubik Pixels' },
	{ label: '[Special] Honk', value: 'Honk' },
	{ label: '[Special] Space Mono', value: 'Space Mono' },
	{ label: '[Special] Inconsolata', value: 'Inconsolata' },
	{ label: '[Special] Azeret Mono', value: 'Azeret Mono' },
	{ label: '[Special] Bricolage Grotesque', value: 'Bricolage Grotesque' },
];

const sansSerifFonts: Font[] = [
	{ label: 'DM Sans', value: 'DM Sans' },
	{ label: 'Inter', value: 'Inter' },
	{ label: 'Work Sans', value: 'Work Sans' },
	{ label: 'Libre Franklin', value: 'Libre Franklin' },
	{ label: 'Fira Sans', value: 'Fira Sans' },
	{ label: 'Alegreya Sans', value: 'Alegreya Sans' },
	{ label: 'Source Sans Pro', value: 'Source Sans Pro' },
	{ label: 'Roboto', value: 'Roboto' },
	{ label: 'Poppins', value: 'Poppins' },
	{ label: 'Archivo Narrow', value: 'Archivo Narrow' },
	{ label: 'Karla', value: 'Karla' },
	{ label: 'Proza Libre', value: 'Proza Libre' },
	{ label: 'IBM Plex Sans', value: 'IBM Plex Sans' },
	{ label: 'Manrope', value: 'Manrope' },
	{ label: 'Montserrat', value: 'Montserrat' },
	{ label: 'Lato', value: 'Lato' },
	{ label: 'PT Sans', value: 'PT Sans' },
	{ label: 'Chivo', value: 'Chivo' },
	{ label: 'Rubik', value: 'Rubik' },
	{ label: 'Open Sans', value: 'Open Sans' },
	{ label: 'Raleway', value: 'Raleway' },
	{ label: 'Overpass', value: 'Overpass' },
	{ label: 'Josefin Sans', value: 'Josefin Sans' },
	{ label: 'Varela Round', value: 'Varela Round' },
	{ label: 'Rajdhani', value: 'Rajdhani' },
	{ label: 'Nunito Sans', value: 'Nunito Sans' },
	{ label: 'Instrument Sans', value: 'Instrument Sans' },
	{ label: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans' },
	{ label: 'Spartan', value: 'Spartan' },
	{ label: 'Outfit', value: 'Outfit' },
	{ label: 'Syne', value: 'Syne' },
	{ label: 'Familjen Grotesk', value: 'Familjen Grotesk' },
	{ label: 'Albert Sans', value: 'Albert Sans' },
	{ label: 'Arimo', value: 'Arimo' },
	{ label: 'Asap', value: 'Asap' },
	{ label: 'Barlow', value: 'Barlow' },
	{ label: 'Cabin', value: 'Cabin' },
	{ label: 'Cairo', value: 'Cairo' },
	{ label: 'Dosis', value: 'Dosis' },
	{ label: 'Exo 2', value: 'Exo 2' },
	{ label: 'Figtree', value: 'Figtree' },
	{ label: 'Hind', value: 'Hind' },
	{ label: 'Jost', value: 'Jost' },
	{ label: 'Kanit', value: 'Kanit' },
	{ label: 'Lexend', value: 'Lexend' },
	{ label: 'Mulish', value: 'Mulish' },
	{ label: 'Oswald', value: 'Oswald' },
	{ label: 'Quicksand', value: 'Quicksand' },
	{ label: 'Signika', value: 'Signika' },
	{ label: 'Sora', value: 'Sora' },
	{ label: 'Urbanist', value: 'Urbanist' },
];

const serifFonts: Font[] = [
	{ label: 'Cormorant', value: 'Cormorant' },
	{ label: 'Eczar', value: 'Eczar' },
	{ label: 'Alegreya', value: 'Alegreya' },
	{ label: 'Source Serif Pro', value: 'Source Serif Pro' },
	{ label: 'Fraunces', value: 'Fraunces' },
	{ label: 'Inknut Antiqua', value: 'Inknut Antiqua' },
	{ label: 'Libre Baskerville', value: 'Libre Baskerville' },
	{ label: 'Playfair Display', value: 'Playfair Display' },
	{ label: 'Lora', value: 'Lora' },
	{ label: 'Spectral', value: 'Spectral' },
	{ label: 'PT Serif', value: 'PT Serif' },
	{ label: 'Cardo', value: 'Cardo' },
	{ label: 'Neuton', value: 'Neuton' },
	{ label: 'Merriweather', value: 'Merriweather' },
	{ label: 'Zilla Slab', value: 'Zilla Slab' },
	{ label: 'Josefin Slab', value: 'Josefin Slab' },
	{ label: 'Old Standard TT', value: 'Old Standard TT' },
	{ label: 'Bitter', value: 'Bitter' },
	{ label: 'Instrument Serif', value: 'Instrument Serif' },
	{ label: 'Roboto Serif', value: 'Roboto Serif' },
	{ label: 'Newsreader', value: 'Newsreader' },
	{ label: 'DM Serif Text', value: 'DM Serif Text' },
	{ label: 'DM Serif Display', value: 'DM Serif Display' },
	{ label: 'Literata', value: 'Literata' },
	{ label: 'BioRhyme', value: 'BioRhyme' },
	{ label: 'Gentium Basic', value: 'Gentium Basic' },
	{ label: 'Arvo', value: 'Arvo' },
	{ label: 'Domine', value: 'Domine' },
	{ label: 'EB Garamond', value: 'EB Garamond' },
	{ label: 'Faustina', value: 'Faustina' },
	{ label: 'Merriweather Sans', value: 'Merriweather Sans' },
	{ label: 'Noto Serif', value: 'Noto Serif' },
	{ label: 'Vollkorn', value: 'Vollkorn' },
];

export const fontCategories: FontCategory[] = [
	{ name: 'CJK (中日韓)', fonts: cjkFonts },
	{ name: 'Specialty (特殊)', fonts: specialtyFonts },
	{ name: 'Sans-Serif (無襯線)', fonts: sansSerifFonts },
	{ name: 'Serif (襯線)', fonts: serifFonts },
];

export const allFonts: Font[] = [...cjkFonts, ...specialtyFonts, ...sansSerifFonts, ...serifFonts];
