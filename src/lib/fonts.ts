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
import '@fontsource/42dot-sans';
import '@fontsource/bagel-fat-one';
import '@fontsource/biz-udgothic';
import '@fontsource/biz-udmincho';
import '@fontsource/biz-udpgothic';
import '@fontsource/biz-udpmincho';
import '@fontsource/black-and-white-picture';
import '@fontsource/chiron-hei-hk';
import '@fontsource/chocolate-classical-sans';
import '@fontsource/do-hyeon';
import '@fontsource/dokdo';
import '@fontsource/dotgothic16';
import '@fontsource/east-sea-dokdo';
import '@fontsource/gugi';
import '@fontsource/huninn';
import '@fontsource/hachi-maru-pop';
import '@fontsource/hi-melody';
import '@fontsource/kiwi-maru';
import '@fontsource/kosugi';
import '@fontsource/kosugi-maru';
import '@fontsource/m-plus-1';
import '@fontsource/m-plus-1-code';
import '@fontsource/m-plus-2';
import '@fontsource/mochiy-pop-one';

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
import '@fontsource/aboreto';
import '@fontsource/adlam-display';
import '@fontsource/aguafina-script';
import '@fontsource/akaya-kanadaka';
import '@fontsource/akaya-telivigala';
import '@fontsource/akronim';
import '@fontsource/aladin';
import '@fontsource/alkatra';
import '@fontsource/allan';
import '@fontsource/allison';
import '@fontsource/allura';
import '@fontsource/almendra-display';
import '@fontsource/amarante';
import '@fontsource/amatic-sc';
import '@fontsource/amita';
import '@fontsource/angkor';
import '@fontsource/anonymous-pro';
import '@fontsource/anybody';
import '@fontsource/are-you-serious';
import '@fontsource/arima';
import '@fontsource/astloch';
import '@fontsource/atma';
import '@fontsource/atomic-age';
import '@fontsource/aubrey';
import '@fontsource/audiowide';

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
import '@fontsource/abeezee';
import '@fontsource/abel';
import '@fontsource/aclonica';
import '@fontsource/acme';
import '@fontsource/actor';
import '@fontsource/advent-pro';
import '@fontsource/afacad';
import '@fontsource/agdasima';
import '@fontsource/aileron';
import '@fontsource/akatab';
import '@fontsource/akshar';
import '@fontsource/alata';
import '@fontsource/alatsi';
import '@fontsource/aldrich';
import '@fontsource/alef';
import '@fontsource/alegreya-sans-sc';
import '@fontsource/alexandria';
import '@fontsource/allerta';
import '@fontsource/allerta-stencil';
import '@fontsource/almarai';
import '@fontsource/alumni-sans';
import '@fontsource/amaranth';
import '@fontsource/amiko';
import '@fontsource/anaheim';
import '@fontsource/andika';

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
import '@fontsource/abhaya-libre';
import '@fontsource/abyssinica-sil';
import '@fontsource/adamina';
import '@fontsource/alike';
import '@fontsource/alike-angular';
import '@fontsource/alkalami';
import '@fontsource/almendra';
import '@fontsource/almendra-sc';
import '@fontsource/amethysta';
import '@fontsource/amiri';
import '@fontsource/amiri-quran';
import '@fontsource/andada-pro';
import '@fontsource/annapurna-sil';
import '@fontsource/antic-didone';
import '@fontsource/antic-slab';
import '@fontsource/aoboshi-one';
import '@fontsource/arapey';
import '@fontsource/arbutus';
import '@fontsource/arbutus-slab';
import '@fontsource/artifika';
import '@fontsource/asar';
import '@fontsource/asul';
import '@fontsource/average';
import '@fontsource/b612';
import '@fontsource/bacasime-antique';

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
	{ label: '[CJK] 42dot Sans', value: '42dot Sans' },
	{ label: '[CJK] Bagel Fat One', value: 'Bagel Fat One' },
	{ label: '[CJK] BIZ UDGothic', value: 'BIZ UDGothic' },
	{ label: '[CJK] BIZ UDMincho', value: 'BIZ UDMincho' },
	{ label: '[CJK] BIZ UDPGothic', value: 'BIZ UDPGothic' },
	{ label: '[CJK] BIZ UDPMincho', value: 'BIZ UDPMincho' },
	{ label: '[CJK] Black And White Picture', value: 'Black And White Picture' },
	{ label: '[CJK] Chiron Hei HK', value: 'Chiron Hei HK' },
	{ label: '[CJK] Chocolate Classical Sans', value: 'Chocolate Classical Sans' },
	{ label: '[CJK] Do Hyeon', value: 'Do Hyeon' },
	{ label: '[CJK] Dokdo', value: 'Dokdo' },
	{ label: '[CJK] DotGothic16', value: 'DotGothic16' },
	{ label: '[CJK] East Sea Dokdo', value: 'East Sea Dokdo' },
	{ label: '[CJK] Gugi', value: 'Gugi' },
	{ label: '[CJK] Huninn', value: 'Huninn' },
	{ label: '[CJK] Hachi Maru Pop', value: 'Hachi Maru Pop' },
	{ label: '[CJK] Hi Melody', value: 'Hi Melody' },
	{ label: '[CJK] Kiwi Maru', value: 'Kiwi Maru' },
	{ label: '[CJK] Kosugi', value: 'Kosugi' },
	{ label: '[CJK] Kosugi Maru', value: 'Kosugi Maru' },
	{ label: '[CJK] M PLUS 1', value: 'M PLUS 1' },
	{ label: '[CJK] M PLUS 1 Code', value: 'M PLUS 1 Code' },
	{ label: '[CJK] M PLUS 2', value: 'M PLUS 2' },
	{ label: '[CJK] Mochiy Pop One', value: 'Mochiy Pop One' }
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
	{ label: '[Special] Aboreto', value: 'Aboreto' },
	{ label: '[Special] ADLaM Display', value: 'ADLaM Display' },
	{ label: '[Special] Aguafina Script', value: 'Aguafina Script' },
	{ label: '[Special] Akaya Kanadaka', value: 'Akaya Kanadaka' },
	{ label: '[Special] Akaya Telivigala', value: 'Akaya Telivigala' },
	{ label: '[Special] Akronim', value: 'Akronim' },
	{ label: '[Special] Aladin', value: 'Aladin' },
	{ label: '[Special] Alkatra', value: 'Alkatra' },
	{ label: '[Special] Allan', value: 'Allan' },
	{ label: '[Special] Allison', value: 'Allison' },
	{ label: '[Special] Allura', value: 'Allura' },
	{ label: '[Special] Almendra Display', value: 'Almendra Display' },
	{ label: '[Special] Amarante', value: 'Amarante' },
	{ label: '[Special] Amatic SC', value: 'Amatic SC' },
	{ label: '[Special] Amita', value: 'Amita' },
	{ label: '[Special] Angkor', value: 'Angkor' },
	{ label: '[Special] Anonymous Pro', value: 'Anonymous Pro' },
	{ label: '[Special] Anybody', value: 'Anybody' },
	{ label: '[Special] Are You Serious', value: 'Are You Serious' },
	{ label: '[Special] Arima', value: 'Arima' },
	{ label: '[Special] Astloch', value: 'Astloch' },
	{ label: '[Special] Atma', value: 'Atma' },
	{ label: '[Special] Atomic Age', value: 'Atomic Age' },
	{ label: '[Special] Aubrey', value: 'Aubrey' },
	{ label: '[Special] Audiowide', value: 'Audiowide' }
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
	{ label: 'ABeeZee', value: 'ABeeZee' },
	{ label: 'Abel', value: 'Abel' },
	{ label: 'Aclonica', value: 'Aclonica' },
	{ label: 'Acme', value: 'Acme' },
	{ label: 'Actor', value: 'Actor' },
	{ label: 'Advent Pro', value: 'Advent Pro' },
	{ label: 'Afacad', value: 'Afacad' },
	{ label: 'Agdasima', value: 'Agdasima' },
	{ label: 'Aileron', value: 'Aileron' },
	{ label: 'Akatab', value: 'Akatab' },
	{ label: 'Akshar', value: 'Akshar' },
	{ label: 'Alata', value: 'Alata' },
	{ label: 'Alatsi', value: 'Alatsi' },
	{ label: 'Aldrich', value: 'Aldrich' },
	{ label: 'Alef', value: 'Alef' },
	{ label: 'Alegreya Sans SC', value: 'Alegreya Sans SC' },
	{ label: 'Alexandria', value: 'Alexandria' },
	{ label: 'Allerta', value: 'Allerta' },
	{ label: 'Allerta Stencil', value: 'Allerta Stencil' },
	{ label: 'Almarai', value: 'Almarai' },
	{ label: 'Alumni Sans', value: 'Alumni Sans' },
	{ label: 'Amaranth', value: 'Amaranth' },
	{ label: 'Amiko', value: 'Amiko' },
	{ label: 'Anaheim', value: 'Anaheim' },
	{ label: 'Andika', value: 'Andika' }
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
	{ label: 'Abhaya Libre', value: 'Abhaya Libre' },
	{ label: 'Abyssinica SIL', value: 'Abyssinica SIL' },
	{ label: 'Adamina', value: 'Adamina' },
	{ label: 'Alike', value: 'Alike' },
	{ label: 'Alike Angular', value: 'Alike Angular' },
	{ label: 'Alkalami', value: 'Alkalami' },
	{ label: 'Almendra', value: 'Almendra' },
	{ label: 'Almendra SC', value: 'Almendra SC' },
	{ label: 'Amethysta', value: 'Amethysta' },
	{ label: 'Amiri', value: 'Amiri' },
	{ label: 'Amiri Quran', value: 'Amiri Quran' },
	{ label: 'Andada Pro', value: 'Andada Pro' },
	{ label: 'Annapurna SIL', value: 'Annapurna SIL' },
	{ label: 'Antic Didone', value: 'Antic Didone' },
	{ label: 'Antic Slab', value: 'Antic Slab' },
	{ label: 'Aoboshi One', value: 'Aoboshi One' },
	{ label: 'Arapey', value: 'Arapey' },
	{ label: 'Arbutus', value: 'Arbutus' },
	{ label: 'Arbutus Slab', value: 'Arbutus Slab' },
	{ label: 'Artifika', value: 'Artifika' },
	{ label: 'Asar', value: 'Asar' },
	{ label: 'Asul', value: 'Asul' },
	{ label: 'Average', value: 'Average' },
	{ label: 'B612', value: 'B612' },
	{ label: 'Bacasime Antique', value: 'Bacasime Antique' }
];

export const fontCategories: FontCategory[] = [
	{ name: 'CJK (中日韓)', fonts: cjkFonts },
	{ name: 'Specialty (特殊)', fonts: specialtyFonts },
	{ name: 'Sans-Serif (無襯線)', fonts: sansSerifFonts },
	{ name: 'Serif (襯線)', fonts: serifFonts }
];

export const allFonts: Font[] = [...cjkFonts, ...specialtyFonts, ...sansSerifFonts, ...serifFonts];
