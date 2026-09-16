import * as p from './progression.mjs';
import {createBattle,start,tickAuto} from './expedition-engine.mjs';
const mergeNeed=(run,id)=>id?run.owned[id]%3===2:0;
export function campaign(seed,policy='draft'){let run=p.createRun(seed),history=[];for(let i=0;i<p.maxRound&&!['won','lost'].includes(run.phase);i++){
 if(policy==='hold'&&i===0){run=p.buy(run,0);run=p.buy(run,1);}
 for(let attempts=0;policy==='draft'&&attempts<10;attempts++){
  const offers=run.shop.map((c,index)=>({...c,index})).filter(c=>(c.type==='beast'||c.type==='egg')&&!c.sold&&(c.type==='egg'?run.gold>=4:run.gold>=p.CARDS[c.id].cost&&run.owned[c.id]<9)).sort((a,b)=>(b.type==='egg'&&p.roster(run).length<6)-(a.type==='egg'&&p.roster(run).length<6)||mergeNeed(run,b.id)-mergeNeed(run,a.id));
  const best=offers.find(c=>c.type==='egg'?p.roster(run).length<6:p.roster(run).length<6||run.owned[c.id]>0);
  if(best){run=p.buy(run,best.index);continue;}
  if(run.level<6&&run.xp+run.gold>=p.nextShopXp(run.level)&&(run.level<3||run.round>=4)){run=p.train(run);continue;}
  if(run.gold>=3){run=p.reroll(run);continue;}break;
 }
 const cards=p.roster(run).sort((a,b)=>b.stars-a.stars).slice(0,6),back=[0,2,4],front=[1,3,5];run.formation=Array(6).fill(null);for(const c of cards){const slots=p.cardOf(run,c.cardId).kind==='bird'?back:front;const slot=slots.find(i=>!run.formation[i])??run.formation.findIndex(x=>!x);run=p.placeUnit(run,c.id,slot);}
 const state=createBattle(run);start(state);for(let n=0;n<3700&&state.phase==='battle';n++)tickAuto(state,1/60);
 history.push({round:run.round,result:state.phase,gold:run.gold,level:run.level,team:cards.map(c=>c.cardId+':'+c.stars),time:Math.round(state.time)});run=p.settle(p.begin(run),state.phase==='won');if(run.phase==='reward'){const pick=['harvest','fang','focus','vigor','ember','tide','brood','lotus','storm','drum','soil','thorn'].find(x=>run.rewards.includes(x))||run.rewards[0];run=p.chooseRelic(run,pick);}
 }return {seed,phase:run.phase,history};}
if(import.meta.url===`file://${process.argv[1]}`)for(let seed=1;seed<=10;seed++)console.log(JSON.stringify(campaign(seed)));
