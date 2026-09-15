import {art} from './art.mjs';

const deer=()=>`<svg class="art" viewBox="0 0 200 200"><path fill="#819778" d="M82 118L70 185H88L104 137 119 185H136L119 111Z"/><path fill="#d6c696" d="M73 75L91 49H113L129 76 115 137H89Z"/><path fill="none" stroke="#d6c696" stroke-width="5" d="M86 57L65 28 66 6M72 40L47 26 44 10M117 57L139 27 140 6M131 39L160 25 162 11"/><path fill="#c0b487" d="M80 78L47 61 60 94ZM123 78L155 63 143 96Z"/><circle cx="89" cy="89" r="4" fill="#19372f"/><circle cx="114" cy="89" r="4" fill="#19372f"/><path fill="#29493c" d="M96 111H108L102 119Z"/><circle cx="94" cy="145" r="3" fill="#efdeb2"/></svg>`;
const bird=(accent='#e2b76e',body='#b66540',crest='#e7a65d',extra='')=>`<svg class="art" viewBox="0 0 200 200"><path fill="${body}" d="M100 119L17 45 50 132 87 146 40 179 109 151 166 178 133 131 184 37Z"/><path fill="${accent}" d="M92 52L116 41 132 62 119 93 123 137 101 157 87 132Z"/><path fill="#f2d695" d="M129 63L158 74 127 79Z"/><circle cx="117" cy="61" r="4" fill="#244333"/><path stroke="#d9be87" stroke-width="5" d="M103 149L105 185 91 192"/><path fill="${crest}" d="M97 46L77 13 111 36 131 15 122 45Z"/>${extra}</svg>`;
const turtle=(shell='#527e72',skin='#90ae9c',extra='')=>`<svg class="art" viewBox="0 0 200 200"><path fill="${skin}" d="M59 117L26 145 40 159 74 137M135 116L170 144 159 160 127 137M58 78L30 53 44 40 73 65M133 78L163 44 178 61 147 90"/><ellipse cx="104" cy="35" rx="18" ry="25" fill="#a7bd9d"/><circle cx="99" cy="27" r="3" fill="#18362c"/><path fill="${shell}" stroke="#c6c99c" stroke-width="5" d="M58 65L102 48 148 66 158 114 130 150H75L48 115Z"/><path fill="none" stroke="#b8c193" stroke-width="3" d="M82 79H119L137 110 116 132H83L66 107ZM102 48V79M148 66L119 79M158 114L137 110M130 150L116 132M75 150L83 132M48 115L66 107M58 65L82 79"/>${extra}</svg>`;
const wolf=(fur='#8f6e58',mane='#c8a06b',extra='')=>`<svg class="art" viewBox="0 0 200 200"><path fill="#5e463c" d="M70 136L51 188H70L93 147 117 189H138L123 137Z"/><path fill="${fur}" d="M47 88L77 51 115 43 153 73 145 128 104 156 62 134Z"/><path fill="${mane}" d="M73 48L49 16 96 38 126 16 121 46Z"/><path fill="#e0c58c" d="M147 76L184 60 154 98Z"/><circle cx="112" cy="75" r="5" fill="#17251f"/><path fill="#202d29" d="M121 100L137 104 124 113Z"/><path stroke="#e2c987" stroke-width="5" d="M85 150L70 185 54 190"/>${extra}</svg>`;

export function portrait(id){
  if(['deer','rabbit','fox'].includes(id))return id==='deer'?deer():art(id);
  if(id==='wolf')return wolf();
  if(id==='shadow_wolf')return wolf('#53667c','#b8b7d9','<path fill="#9bd1ff88" d="M49 88Q84 74 112 92Q86 110 56 119Z"/><path fill="#d8e8ff" d="M126 40L146 24 141 55Z"/>');
  if(id==='blood_wolf')return wolf('#8b3d35','#e06c55','<path fill="#f2a06a" d="M61 130Q103 174 145 127Q111 143 61 130Z"/><circle cx="103" cy="98" r="9" fill="#b7282c"/>');
  if(id==='moon_wolf')return wolf('#6e7890','#d7d4a7','<circle cx="87" cy="62" r="13" fill="#f4e8af"/><path fill="#111b28" d="M93 51A12 12 0 1 0 94 73A9 9 0 1 1 93 51Z"/>');
  if(id==='brood_wolf')return wolf('#6f4a66','#d7a0bd','<circle cx="63" cy="96" r="12" fill="#b48cff88"/><circle cx="78" cy="119" r="8" fill="#d6bcff"/><path fill="#2a1a32" d="M145 77Q165 106 137 125Q148 99 145 77Z"/>');
  if(id==='war_wolf')return wolf('#9a5540','#e0b45f','<path fill="#efc15b" d="M51 20L84 42 47 54Z"/><path fill="#ef7f4f" d="M80 54Q104 28 127 55Q104 48 80 54Z"/>');
  if(id==='fox_wolf')return wolf('#b66a45','#f0c07a','<path fill="#f0c07a" d="M43 137Q18 154 31 181Q52 161 70 146Z"/><path fill="#7d2d40" d="M116 79L143 72 129 89Z"/>');
  if(id==='bird')return bird();
  if(id==='ember_bird')return bird('#8dd39a','#5f9f73','#e6c56c','<path fill="#ef7b45aa" d="M71 132Q104 111 133 132Q111 158 71 132Z"/><circle cx="83" cy="154" r="10" fill="#f28a48"/>');
  if(id==='thunder_bird')return bird('#91c9ff','#49648d','#f7df67','<path fill="#f7df67" d="M58 104L89 90 73 120 103 110 62 158 77 125Z"/>');
  if(id==='sun_bird')return bird('#f4ce55','#cc6e36','#fff2a0','<circle cx="80" cy="72" r="20" fill="#ffdb59aa"/><path fill="#fff0a1" d="M100 16L109 38 132 37 114 51 121 74 101 60 82 74 89 51 70 37 94 38Z"/>');
  if(id==='ghost_bird')return bird('#bfa6ff','#4f4b76','#dfd1ff','<path fill="#d8c7ff88" d="M45 95Q87 73 117 102Q82 113 45 95Z"/><circle cx="91" cy="103" r="11" fill="#2e244b"/><path fill="#fff" d="M88 100H94V106H88Z"/>');
  if(id==='storm_bird')return bird('#9ed7ff','#506a9b','#fff06d','<path fill="#fff06d" d="M118 8L98 57 124 50 95 111 102 68 78 73Z"/><path fill="none" stroke="#9ed7ff" stroke-width="5" d="M39 89Q73 75 104 91T164 88"/>');
  if(id==='turtle')return turtle();
  if(id==='ice_turtle')return turtle('#6c98aa','#b1c8c4','<path fill="none" stroke="#c9f3ff" stroke-width="5" d="M70 72L91 93 67 103M131 72L111 94 137 103M101 54L101 83"/>');
  if(id==='stone_turtle')return turtle('#6f7168','#a0a08c','<path fill="#31382f" d="M75 93L98 67 126 91 113 125 82 124Z"/><path fill="none" stroke="#d4c28a" stroke-width="4" d="M75 93L126 91M98 67L113 125"/>');
  if(id==='moss_turtle')return turtle('#5d875a','#8fb58c','<path fill="#81b85f" d="M72 70Q83 45 102 64Q122 43 132 77Q103 69 72 70Z"/><circle cx="137" cy="117" r="9" fill="#91c967"/>');
  if(id==='lotus_turtle')return turtle('#6d9aa0','#a8c7bc','<path fill="#e5a6c9" d="M84 69Q101 38 118 69Q101 84 84 69Z"/><path fill="#f0c6d8" d="M66 91Q98 74 133 91Q101 113 66 91Z"/>');
  if(id==='earth_turtle')return turtle('#71604b','#ad9d78','<path fill="#7fa35e" d="M70 62Q98 28 132 65Q105 57 70 62Z"/><path fill="#c69b5b" d="M79 111L101 78 126 111 102 132Z"/>');
  if(id==='thorn_turtle')return turtle('#58715d','#a4ad8f','<path fill="#d7c37a" d="M72 76L82 47 95 76 108 43 119 78 138 56 130 91Z"/><path fill="none" stroke="#472f24" stroke-width="4" d="M78 126L101 91 124 126"/>');
  if(id==='taunt_turtle')return turtle('#6f5b3e','#bba77c','<path fill="#e8c96d" d="M55 82L29 65 57 58ZM145 82L173 65 145 58Z"/><path fill="none" stroke="#f1d598" stroke-width="6" d="M71 104Q101 82 132 104M62 124Q101 96 140 124"/><circle cx="103" cy="104" r="9" fill="#32261b"/>');
  return art(id==='forest'?'forest':id==='water'?'moon':'herb');
}
