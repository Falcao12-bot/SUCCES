import React,{useEffect,useState} from 'react';
import { View, Text, FlatList, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';
import { Card, Loading, Empty, Button } from '../components/ui';
import { BlockRenderer } from '../editor/BlockRenderer';
import { Subject, Lesson, Exercise } from '../models';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';
import { FavButton } from './Student2';
function useAsync<T>(f:()=>Promise<T>){const [d,setD]=useState<T>();const [err,setErr]=useState(false);useEffect(()=>{f().then(setD).catch(()=>setErr(true));},[]);return {d,err};}
export function Home({navigation}:any){const {d}=useAsync(api.subjects);
 const tiles:[string,string,string,string,string][]=[['Mes cours','book','#DBEAFE','#2563EB','Courses'],['Exercices','create','#DCFCE7','#16A34A','Exercises'],['Examens','document-text','#E0E7FF','#6366F1','ExamList'],
  ['IA Educative','sparkles','#F3E8FF','#9333EA','AI'],['Ma progression','stats-chart','#DCFCE7','#16A34A','Progress'],['Favoris','star','#FFEDD5','#F97316','Favorites']];
 return <SafeAreaView style={{flex:1,backgroundColor:'#fff'}} edges={['top']}><ScrollView contentContainerStyle={{padding:16,gap:14}} showsVerticalScrollIndicator={false}>
  <View style={{flexDirection:'row',alignItems:'center',gap:12}}><Ionicons name="person-circle" size={46} color="#94A3B8"/><View><Text style={{fontSize:16,fontWeight:'700'}}>Bonjour, Koffi !</Text><Text style={{fontSize:12,color:colors.muted}}>Continue tes efforts, tu vas y arriver !</Text></View></View>
  <View style={{flexDirection:'row',alignItems:'center',height:44,borderRadius:12,borderWidth:1,borderColor:colors.border,paddingHorizontal:12,gap:8}}><Ionicons name="search" size={18} color={colors.muted}/><TextInput placeholder="Rechercher un cours, une matière…" style={{flex:1,fontSize:13}}/></View>
  <LinearGradient colors={['#1D4ED8','#2563EB']} start={{x:0,y:0}} end={{x:1,y:1}} style={{borderRadius:16,padding:18,minHeight:120,justifyContent:'center'}}>
   <Text style={{color:'#fff',fontSize:20,fontWeight:'800',lineHeight:26}}>Apprends,{'\n'}c'est progresser !</Text><Text style={{color:'#DBEAFE',fontSize:12,marginTop:6,maxWidth:'60%'}}>Chaque jour est une nouvelle opportunité.</Text>
   <Ionicons name="school" size={70} color="rgba(255,255,255,.3)" style={{position:'absolute',right:16,bottom:12}}/></LinearGradient>
  <View style={{flexDirection:'row',flexWrap:'wrap',gap:10}}>{tiles.map(([t,i,bg,fg,r])=><Pressable key={t} onPress={()=>navigation.navigate(r)} style={{width:'31%',flexGrow:1}}>
   <View style={{backgroundColor:bg,borderRadius:14,paddingVertical:14,alignItems:'center',gap:8}}><View style={{width:36,height:36,borderRadius:10,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'}}><Ionicons name={i as any} size={20} color={fg}/></View><Text style={{fontSize:11,fontWeight:'600',color:colors.text}}>{t}</Text></View></Pressable>)}</View>
  <View style={{flexDirection:'row',justifyContent:'space-between'}}><Text style={{fontWeight:'700',fontSize:15}}>Mes matières</Text><Text style={{color:colors.primary,fontSize:12}} onPress={()=>navigation.navigate('Courses')}>Voir tout</Text></View>
  {d?d.slice(0,2).map(s=><SubjectRow key={s.id} s={s} onPress={()=>navigation.navigate('Chapters',{subject:s})}/>):<Loading/>}</ScrollView></SafeAreaView>;}
const SubjectRow=({s,onPress}:{s:Subject;onPress:()=>void})=><Pressable onPress={onPress}><Card style={{flexDirection:'row',alignItems:'center',gap:12}}>
 <View style={{width:44,height:44,borderRadius:12,backgroundColor:s.color,alignItems:'center',justifyContent:'center'}}><Ionicons name={s.icon as any} size={22} color="#fff"/></View>
 <View style={{flex:1}}><Text style={{fontWeight:'700',fontSize:14}}>{s.title}</Text><Text style={{fontSize:12,color:colors.muted}} numberOfLines={1}>{s.desc}</Text><Text style={{fontSize:11,color:colors.muted}}>{s.chapters} cours · {s.chapters-4>0?s.chapters-4:s.chapters} exercices</Text></View><Ionicons name="chevron-forward" size={18} color={colors.muted}/></Card></Pressable>;
export function Courses({navigation}:any){const {d,err}=useAsync(api.subjects);const [q,setQ]=useState('');
 if(err)return <Empty text="Erreur de chargement. Réessaie plus tard."/>;if(!d)return <Loading/>;
 const list=d.filter(s=>(s.title+s.desc).toLowerCase().includes(q.toLowerCase()));
 return <View style={{flex:1,backgroundColor:'#fff'}}><View style={{flexDirection:'row',alignItems:'center',height:42,margin:16,marginBottom:4,borderRadius:12,borderWidth:1,borderColor:colors.border,paddingHorizontal:12,gap:8}}><Ionicons name="search" size={18} color={colors.muted}/><TextInput value={q} onChangeText={setQ} placeholder="Rechercher un cours…" style={{flex:1,fontSize:13}}/></View>
  <FlatList data={list} keyExtractor={s=>s.id} contentContainerStyle={{padding:16,gap:12}} ListEmptyComponent={<Empty text="Aucune matière trouvée"/>} renderItem={({item})=><SubjectRow s={item} onPress={()=>navigation.navigate('Chapters',{subject:item})}/>}/></View>;}
export function Chapters({route,navigation}:any){const s:Subject=route.params.subject;const {d}=useAsync(()=>api.chapters(s.id));if(!d)return <Loading/>;
 return <FlatList data={d} keyExtractor={c=>c.id} contentContainerStyle={{padding:16,gap:12}} ListEmptyComponent={<Empty text="Aucun chapitre pour l'instant"/>} renderItem={({item})=><Pressable onPress={()=>navigation.navigate('LessonList',{chapter:item})}><Card><Text style={{fontWeight:'700'}}>{item.title}</Text><Text style={{color:colors.muted,fontSize:12}}>{item.lessons} leçons</Text></Card></Pressable>}/>;}
export function LessonScreen({route,navigation}:any){const {d}=useAsync<Lesson>(()=>api.lesson(route.params.id));if(!d)return <Loading/>;
 return <ScrollView contentContainerStyle={{padding:16,gap:12}}><FavButton id={route.params.id} navigation={navigation}/><View style={{flexDirection:'row',alignItems:'center',gap:12}}><View style={{width:44,height:44,borderRadius:12,backgroundColor:'#22C55E',alignItems:'center',justifyContent:'center'}}><Ionicons name="book" size={22} color="#fff"/></View><View><Text style={{fontSize:18,fontWeight:'800'}}>{d.title}</Text><Text style={{fontSize:12,color:colors.muted}}>Leçon · {d.blocks.length} blocs</Text></View></View>{d.blocks.map(b=><BlockRenderer key={b.id} block={b}/>)}</ScrollView>;}
export function Exercises(){const {d}=useAsync(api.exercises);const [ans,setAns]=useState<Record<string,string>>({});const [ok,setOk]=useState<Record<string,boolean>>({});
 if(!d)return <Loading/>;
 return <ScrollView contentContainerStyle={{padding:16,gap:12}} keyboardShouldPersistTaps="handled">{d.map((e:Exercise)=><Card key={e.id} style={{gap:8}}><Text style={{fontWeight:'700'}}>{e.prompt}</Text>
  {e.type==='qcm'?e.choices!.map(c=><Pressable key={c} onPress={()=>setAns({...ans,[e.id]:c})} style={{padding:10,borderRadius:8,backgroundColor:ans[e.id]===c?'#DBEAFE':'#F8FAFC'}}><Text>{c}</Text></Pressable>)
  :<TextInput placeholder="Ta réponse…" value={ans[e.id]??''} onChangeText={t=>setAns({...ans,[e.id]:t})} style={{borderWidth:1,borderColor:colors.border,borderRadius:8,padding:10}}/>}
  <Button title="Vérifier" onPress={()=>setOk({...ok,[e.id]:ans[e.id]?.trim()===e.answer})}/>
  {e.id in ok&&<Text style={{color:ok[e.id]?colors.green:colors.red,fontWeight:'700'}}>{ok[e.id]?'Bravo !':'Essaie encore'}</Text>}</Card>)}</ScrollView>;}
export function AI(){const [m,setM]=useState<{me:boolean;t:string}[]>([{me:false,t:"Bonjour ! Je suis ton assistant pédagogique. Pose-moi une question."}]);const [q,setQ]=useState('');
 const send=async()=>{if(!q.trim())return;const t=q;setQ('');setM(x=>[...x,{me:true,t}]);const r=await api.ask(t);setM(x=>[...x,{me:false,t:r}]);};
 return <View style={{flex:1}}><FlatList data={m} keyExtractor={(_,i)=>String(i)} contentContainerStyle={{padding:16,gap:8}} renderItem={({item})=><View style={{alignSelf:item.me?'flex-end':'flex-start',maxWidth:'80%',padding:12,borderRadius:14,backgroundColor:item.me?colors.primary:'#fff'}}><Text style={{color:item.me?'#fff':colors.text}}>{item.t}</Text></View>}/>
  <View style={{flexDirection:'row',padding:10,gap:8}}><TextInput value={q} onChangeText={setQ} placeholder="Écris ta question ici…" style={{flex:1,backgroundColor:'#fff',borderRadius:20,paddingHorizontal:14}}/><Button title="Envoyer" onPress={send} style={{paddingHorizontal:14,height:44}}/></View></View>;}
export const Profile=({navigation}:any)=><SafeAreaView style={{flex:1,padding:16,gap:10}}><Card><Text style={{fontWeight:'800',fontSize:18}}>Koffi</Text><Text style={{color:colors.muted}}>Élève · CM2</Text></Card>
 {([['Ma progression','Progress'],['Mes favoris','Favorites'],['Examens','ExamList'],['Paramètres','Settings']] as const).map(([l,r])=><Pressable key={r} onPress={()=>navigation.navigate(r)}><Card><Text style={{fontWeight:'600'}}>{l}</Text></Card></Pressable>)}</SafeAreaView>;
export const Placeholder=({route}:any)=><Empty text={`${route.name} : à brancher`}/>;

export function LessonList({route,navigation}:any){const {d}=useAsync(()=>api.lessonsOf(route.params.chapter.id));if(!d)return <Loading/>;
 return <FlatList data={d} keyExtractor={l=>l.id} contentContainerStyle={{padding:16,gap:12}} ListEmptyComponent={<Empty text="Aucune leçon publiée pour ce chapitre"/>} renderItem={({item})=><Pressable onPress={()=>navigation.navigate('Lesson',{id:item.id})}><Card><Text style={{fontWeight:'700'}}>{item.title}</Text></Card></Pressable>}/>;}
