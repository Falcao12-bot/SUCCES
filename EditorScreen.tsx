import React,{useState} from 'react';
import { View, Text, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Block, CalloutType } from '../models';
import { BlockRenderer } from './BlockRenderer';
import { api } from '../services/api';
import { colors } from '../theme';
import { Button } from '../components/ui';
const uid=()=>Math.random().toString(36).slice(2);
const SYMBOLS=['a/b','xⁿ','√','∑','∫','π','α','β','≤','≥','≠','( )','x²','x₁','∞','±'];
const SHAPES=['circle','square','rectangle','triangle','line','angle','arrow'] as const;
const CALLOUTS:CalloutType[]=['definition','retain','example','method','warning','note','tip'];
const COLORS=['#0F172A','#DC2626','#1D4ED8','#16A34A'];
const Chip=({t,on,onPress}:{t:string;on?:boolean;onPress:()=>void})=><Pressable onPress={onPress} style={{paddingHorizontal:12,paddingVertical:8,borderRadius:8,backgroundColor:on?colors.primary:'#EFF6FF',marginRight:6}}><Text style={{color:on?'#fff':colors.primary,fontWeight:'600'}}>{t}</Text></Pressable>;

export default function EditorScreen({navigation,route}:any){
 const editId:string|undefined=route?.params?.id;
 const [title,setTitle]=useState('');const [blocks,setBlocks]=useState<Block[]>([]);const [sel,setSel]=useState<string>();const [preview,setPreview]=useState(false);
 const add=(b:Omit<Block,'id'>)=>{const id=uid();setBlocks(x=>[...x,{...b,id}]);setSel(id);};
 const upd=(id:string,p:Partial<Block>)=>setBlocks(x=>x.map(b=>b.id===id?{...b,...p}:b));
 const del=(id:string)=>{setBlocks(x=>x.filter(b=>b.id!==id));setSel(undefined);};
 const move=(id:string,d:number)=>setBlocks(x=>{const i=x.findIndex(b=>b.id===id),j=i+d;if(j<0||j>=x.length)return x;const c=[...x];[c[i],c[j]]=[c[j],c[i]];return c;});
 const pick=async(cam:boolean)=>{const r=cam?await ImagePicker.launchCameraAsync({quality:.8}):await ImagePicker.launchImageLibraryAsync({mediaTypes:['images'],quality:.8});if(!r.canceled)add({kind:'image',uri:r.assets[0].uri,widthPct:100,align:'center'});};
 const b=blocks.find(x=>x.id===sel);
 React.useEffect(()=>{if(editId)api.lesson(editId).then(l=>{setTitle(l.title);setBlocks(l.blocks);});},[editId]);

 // Texte : le style s'applique à tout le bloc (portée simple, stockée dans spans)
 const span=(p:any)=>b&&upd(b.id,{spans:[{...(b.spans?.[0]??{}),text:b.spans?.[0]?.text??b.text??'',...p}],text:b.spans?.[0]?.text??b.text});
 const flag=(k:'bold'|'italic'|'underline')=>b&&span({[k]:!b.spans?.[0]?.[k]});
 const setTable=(f:(r:string[][])=>string[][])=>b&&upd(b.id,{rows:f(b.rows??[])});

 const ctx=()=>{ if(!b)return null; const k=b.kind; return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{padding:8,alignItems:'center'}}>
  {(k==='paragraph')&&<><Chip t="G" onPress={()=>flag('bold')}/><Chip t="I" onPress={()=>flag('italic')}/><Chip t="S" onPress={()=>flag('underline')}/>
    {COLORS.map(c=><Pressable key={c} onPress={()=>span({color:c})} style={{width:28,height:28,borderRadius:14,backgroundColor:c,marginRight:6}}/>)}
    <Chip t="Surligner" onPress={()=>span({highlight:'#FEF08A'})}/></>}
  {(k==='paragraph'||k==='heading'||k==='subheading')&&(['left','center','right'] as const).map(a=><Chip key={a} t={a==='left'?'⇤':a==='center'?'↔':'⇥'} on={b.align===a} onPress={()=>upd(b.id,{align:a})}/>)}
  {k==='paragraph'&&<><Chip t="Titre" onPress={()=>upd(b.id,{kind:'heading'})}/></>}
  {k==='heading'&&<><Chip t="Sous-titre" onPress={()=>upd(b.id,{kind:'subheading'})}/><Chip t="Paragraphe" onPress={()=>upd(b.id,{kind:'paragraph'})}/></>}
  {k==='table'&&<><Chip t="+ ligne" onPress={()=>setTable(r=>[...r,Array(r[0]?.length??2).fill('')])}/><Chip t="− ligne" onPress={()=>setTable(r=>r.length>1?r.slice(0,-1):r)}/>
    <Chip t="+ colonne" onPress={()=>setTable(r=>r.map(l=>[...l,'']))}/><Chip t="− colonne" onPress={()=>setTable(r=>r[0]?.length>1?r.map(l=>l.slice(0,-1)):r)}/></>}
  {k==='image'&&<>{(['left','center','right'] as const).map(a=><Chip key={a} t={a==='left'?'⇤':a==='center'?'↔':'⇥'} on={b.align===a} onPress={()=>upd(b.id,{align:a})}/>)}
    <Chip t="−" onPress={()=>upd(b.id,{widthPct:Math.max(30,(b.widthPct??100)-10)})}/><Chip t={`${b.widthPct??100}%`} onPress={()=>{}}/><Chip t="+" onPress={()=>upd(b.id,{widthPct:Math.min(100,(b.widthPct??100)+10)})}/></>}
  {k==='figure'&&SHAPES.map(s=><Chip key={s} t={s} on={b.shape===s} onPress={()=>upd(b.id,{shape:s})}/>)}
  {k==='formula'&&SYMBOLS.map(s=><Chip key={s} t={s} onPress={()=>upd(b.id,{latex:(b.latex??'')+(s==='a/b'?'1/2':s==='( )'?'()':s)})}/>)}
  {k==='callout'&&CALLOUTS.map(c=><Chip key={c} t={c} on={b.callout===c} onPress={()=>upd(b.id,{callout:c})}/>)}
  <Chip t="↑" onPress={()=>move(b.id,-1)}/><Chip t="↓" onPress={()=>move(b.id,1)}/><Chip t="Suppr." onPress={()=>del(b.id)}/>
 </ScrollView>;};

 const editor=(x:Block)=>{
  if(x.kind==='table')return <View><BlockRenderer block={x}/>{sel===x.id&&x.rows!.map((r,i)=><View key={i} style={{flexDirection:'row',marginTop:4}}>{r.map((c,j)=><TextInput key={j} value={c} placeholder="…" onChangeText={t=>upd(x.id,{rows:x.rows!.map((l,a)=>l.map((v,bb)=>a===i&&bb===j?t:v))})} style={{flex:1,borderWidth:1,borderColor:colors.border,padding:6,fontSize:12}}/>)}</View>)}</View>;
  if(x.kind==='image'||x.kind==='figure')return <View><BlockRenderer block={x}/>{sel===x.id&&<TextInput placeholder="Légende (optionnel)" value={x.caption??''} onChangeText={t=>upd(x.id,{caption:t})} style={{borderWidth:1,borderColor:colors.border,borderRadius:8,padding:8,marginTop:6}}/>}</View>;
  if(sel!==x.id)return <BlockRenderer block={x}/>;
  const f=x.kind==='formula';
  return <TextInput multiline autoFocus value={(f?x.latex:x.spans?.[0]?.text??x.text)??''} placeholder="Saisir…"
   onChangeText={t=>upd(x.id,f?{latex:t}:{text:t,spans:x.spans?[{...x.spans[0],text:t}]:undefined})} style={{borderWidth:1.5,borderColor:colors.primary,borderRadius:10,padding:10}}/>;
 };
 const tools:[string,string,()=>void][]=[
  ['Texte','text',()=>add({kind:'paragraph',text:''})],['Image','image',()=>pick(false)],['Photo','camera',()=>pick(true)],
  ['Tableau','grid',()=>add({kind:'table',rows:[['',''],['','']]})],['Formule','calculator',()=>add({kind:'formula',latex:''})],
  ['Figure','shapes',()=>add({kind:'figure',shape:'circle'})],['Bloc','albums',()=>add({kind:'callout',callout:'definition',text:''})]];
 const save=async(status:'draft'|'published')=>{if(!title.trim())return Alert.alert('Titre requis','Ajoute un titre au cours.');await api.saveLesson({id:editId??uid(),chapterId:'c1',title,status,blocks});Alert.alert(status==='published'?'Publié':'Brouillon enregistré');navigation.goBack();};
 return <KeyboardAvoidingView style={{flex:1,backgroundColor:'#fff'}} behavior={Platform.OS==='ios'?'padding':undefined}>
  <View style={{flexDirection:'row',padding:12,gap:8}}><TextInput placeholder="Titre du cours" value={title} onChangeText={setTitle} style={{flex:1,borderWidth:1,borderColor:colors.border,borderRadius:10,paddingHorizontal:12}}/>
   <Button title={preview?'Éditer':'Aperçu'} onPress={()=>{setPreview(!preview);setSel(undefined);}} style={{paddingHorizontal:14,height:44}}/></View>
  <ScrollView contentContainerStyle={{padding:16,gap:12}} keyboardShouldPersistTaps="handled">
   {blocks.length===0&&<Text style={{color:colors.muted,textAlign:'center',marginTop:30}}>Ajoute un premier bloc avec la barre du bas.</Text>}
   {blocks.map(x=>preview?<BlockRenderer key={x.id} block={x}/>:<Pressable key={x.id} onPress={()=>setSel(x.id)} style={sel===x.id?{borderLeftWidth:3,borderColor:colors.primary,paddingLeft:8}:undefined}>{editor(x)}</Pressable>)}
  </ScrollView>
  {!preview&&<View style={{borderTopWidth:1,borderColor:colors.border}}>{ctx()}
   <View style={{flexDirection:'row',justifyContent:'space-around',paddingVertical:8}}>{tools.map(([l,i,f])=><Pressable key={l} onPress={f} style={{alignItems:'center'}}><Ionicons name={i as any} size={22} color={colors.primary}/><Text style={{fontSize:11}}>{l}</Text></Pressable>)}</View></View>}
  <View style={{flexDirection:'row',gap:8,padding:12}}><Button title="Brouillon" variant="outline" style={{flex:1,borderColor:colors.primary}} onPress={()=>save('draft')}/><Button title="Publier" style={{flex:1}} onPress={()=>save('published')}/></View>
 </KeyboardAvoidingView>;}
