import { Subject, Chapter, Lesson, Exercise, User } from '../models';
// Remplacer ces fonctions par des appels fetch() vers votre API.
const subjects:Subject[]=[
 {id:'math',title:'Mathématiques',desc:'Fractions, nombres décimaux, géométrie…',color:'#22C55E',icon:'calculator',chapters:12},
 {id:'fr',title:'Français',desc:'Lecture, grammaire, conjugaison…',color:'#EC4899',icon:'book',chapters:10},
 {id:'pc',title:'Physique-Chimie',desc:'Matière, énergie, électricité…',color:'#3B82F6',icon:'flask',chapters:8},
 {id:'svt',title:'SVT',desc:"Le vivant, la terre, l'environnement…",color:'#10B981',icon:'leaf',chapters:7},
 {id:'hg',title:'Histoire-Géographie',desc:'Le monde, notre pays, les sociétés…',color:'#F97316',icon:'globe',chapters:6}];
const chapters:Chapter[]=[{id:'c1',subjectId:'math',title:'Les fractions',lessons:4},{id:'c2',subjectId:'math',title:'Les décimaux',lessons:3}];
let lessons:Lesson[]=[{id:'l1',chapterId:'c1',title:'Les fractions',status:'published',blocks:[
 {id:'b1',kind:'heading',text:'1. Définition'},
 {id:'b2',kind:'paragraph',text:"Une fraction est une façon d'écrire une partie d'un tout. Elle est composée de deux nombres : le numérateur et le dénominateur."},
 {id:'b3',kind:'callout',callout:'retain',text:'Le dénominateur indique en combien de parts le tout est divisé.'},
 {id:'b4',kind:'formula',latex:'x² + 3x + 2 = 0'},
 {id:'b5',kind:'table',rows:[['Fraction','Lecture'],['1/2','un demi'],['3/4','trois quarts']]},
 {id:'b6',kind:'figure',shape:'circle',caption:'Cercle partagé en 4 parts'}]}];
const exercises:Exercise[]=[{id:'e1',prompt:'Calcule : 5 + 3 × 2',type:'qcm',choices:['16','11','13','10'],answer:'11'},{id:'e2',prompt:'Résous : x² − 4 = 0 (x > 0)',type:'text',answer:'2'}];
const examList=[{id:'x1',title:'Examen blanc CM2',questions:20},{id:'x2',title:'Composition 6e',questions:30}];
const wait=<T,>(v:T)=>new Promise<T>(r=>setTimeout(()=>r(v),300));
export const api={
 login:(email:string,pw:string):Promise<User>=>wait({id:'u1',name:'Koffi',role:email.startsWith('admin')?'admin':'student',level:'CM2'}),
 subjects:()=>wait(subjects), chapters:(sid:string)=>wait(chapters.filter(c=>c.subjectId===sid)),
 lesson:(id:string)=>wait(lessons.find(l=>l.id===id)!), exercises:()=>wait(exercises),
 saveLesson:(l:Lesson)=>{lessons=lessons.some(x=>x.id===l.id)?lessons.map(x=>x.id===l.id?l:x):[...lessons,l];return wait(l);},
 lessonsOf:(cid:string)=>wait(lessons.filter(l=>l.chapterId===cid&&l.status==='published')),
 addExercise:(e:Exercise)=>{exercises.push(e);return wait(e);},
 addExam:(title:string,questions:number)=>{examList.push({id:String(Date.now()),title,questions});return wait(true);},
 register:(name:string,email:string,pw:string)=>wait(true),
 reset:(email:string)=>wait(true),
 allLessons:()=>wait([...lessons]),
 deleteLesson:(id:string)=>{lessons=lessons.filter(l=>l.id!==id);return wait(true);},
 users:()=>wait<User[]>([{id:'u1',name:'Koffi',role:'student',level:'CM2'},{id:'u2',name:'Aminata Koné',role:'student',level:'6e'},{id:'u3',name:'Admin',role:'admin',level:'-'}]),
 exams:()=>wait([...examList]),
 exercisesAdmin:()=>wait(exercises),
 ask:(q:string)=>wait(`Réponse de démonstration à : « ${q} ». Branchez ici votre service d'IA.`)};
