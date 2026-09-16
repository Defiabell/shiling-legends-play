import test from 'node:test';
import assert from 'node:assert/strict';
import {toggleLanguage,tx} from './i18n.mjs';

test('i18n translates core gameplay labels and keeps Chinese unchanged',()=>{
 assert.equal(toggleLanguage('zh'),'en');
 assert.equal(toggleLanguage('en'),'zh');
 assert.equal(tx('第 3 / 10 战 · 8 金 · 商店 2星','en'),'Battle 3 / 10 · 8 Gold · Shop Lv.2');
 assert.equal(tx('伙伴融合：抽中：巨躯混沌灵，生命 +46，击杀召唤','en'),'Companion Fusion：Rolled: ColossusChaos Spirit，HP +46，Kill Summon');
 assert.equal(tx('伙伴融合','zh'),'伙伴融合');
});
