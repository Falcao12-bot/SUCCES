export type BlockKind='paragraph'|'heading'|'subheading'|'image'|'table'|'formula'|'figure'|'callout';
export type CalloutType='definition'|'retain'|'example'|'method'|'warning'|'note'|'tip';
export interface Block {
  id:string; kind:BlockKind;
  text?:string; spans?:{text:string;bold?:boolean;italic?:boolean;underline?:boolean;color?:string;highlight?:string}[];
  align?:'left'|'center'|'right'; uri?:string; caption?:string; widthPct?:number;
  rows?:string[][]; latex?:string; shape?:'circle'|'square'|'rectangle'|'triangle'|'line'|'angle'|'arrow';
  callout?:CalloutType;
}
export interface Lesson{id:string;chapterId:string;title:string;status:'draft'|'published';blocks:Block[]}
export interface Chapter{id:string;subjectId:string;title:string;lessons:number}
export interface Subject{id:string;title:string;desc:string;color:string;icon:string;chapters:number}
export interface Exercise{id:string;prompt:string;type:'qcm'|'text';choices?:string[];answer:string}
export interface User{id:string;name:string;role:'student'|'admin';level:string}
