import { useEffect, useState } from "react";
import supabase from "./supabase";
import "./style.css";
const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

function Counter() {
  let [count, setCount] = useState(0)
  return (
  <div>
    <span style={{fontSize: "40px"}}> {count} </span>
    <button className="btn btn-large" 
    onClick={()=> setCount((c)=> c + 1)}>1
    </button>
  </div>
  );
}

function App() {
  // Define state variable
  const [showForm, setShowForm] = useState(false)
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all")

 useEffect(function(){
async function getFacts() {
  setIsLoading(true);
  let query = supabase.from("facts")
  .select("*");

  if(currentCategory !== "all") {
    query = query.eq("category", currentCategory);
  }
  const { data: facts, error } = await query
  .order("votesForInteresting", {ascending:false})
  .limit(1000);

 if(!error) {
  setFacts(facts);
 }
 else{
  alert("There is a problem in getting data");
 }
  
  setIsLoading(false);
}
getFacts();
 }, [currentCategory]);

  return (
    <>
<Header showForm= {showForm} setShowForm = {setShowForm}/> 
<Counter />

{/* Use state variable */}
{showForm ? <NewFactForm setFacts={setFacts} setShowForm={setShowForm}/> : null }

<main className="main">
  <CategoryFilter setCurrentCategory = {setCurrentCategory}/>
  {isLoading ? <Loader /> : <FactList facts={facts} />}
</main>
</>
);
}

function Loader() {
  return <p className="message">Loading...</p>;
}


function Header(props) {
  const {showForm, setShowForm} = props;
  const appTitle = "Today I Learned..";

  return (
    <header className="header">
  <div className="logo">
  <img src="logo.png" alt="Today I Learned logo" height="68" width="68"/>
  <h1>{appTitle}</h1>
  </div>
  <button className="btn btn-large btn-opn" 

  onClick={() => setShowForm((show) => !show)}>{showForm ? "Close" : "Share a Fact"}</button>
</header>
  )
}

// copied code IsValidUrl
function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

function NewFactForm(props) {
  const {setFacts, setShowForm} = props;
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const textLength = text.length;

  async function handleSubmit(e) {
  //1. prevent default, (browser reload)
  e.preventDefault();
  //2. if the data is valid, if so, create a new fact obj
  
  if(text && isValidHttpUrl(source) && category && text.length <= 300) {
  console.log(text, source, category);
    //3. create a new fact object
  // const newFact = {
  //   id: Math.floor(Math.random() * 10),
  //   text,
  //   source,
  //   category,
  //   votesInteresting: 0,
  //   votesMindblowing: 0,
  //   votesFalse: 0,
  //   createdIn: new Date().getFullYear(),
  // }
  //3. Upload fact to supabase and recieve new fact object
  setIsUploading(true);
   const {data:newFact, error} = await supabase.from("facts")
   .insert([{text, source, category}])
   .select();
   setIsUploading(false);

  //4. add the new fact to the user interface

  setFacts((facts)=>[newFact[0], ...facts]);
  //5. reset the input field
  setText("");
  setSource("");
  setCategory("");
  //6. close the form
  setShowForm(false);
  }
  }

  return (
  <form className="fact-form" onSubmit={handleSubmit}>
    <input type="text" id="" placeholder="Share the fact with the world..." value = {text}
    onChange={(e) => setText(e.target.value)}/>

    <span>{300 - textLength} </span>

    <input type="text" id="" placeholder="Trustworty source.."
    value = {source}
    onChange = {(e) => setSource(e.target.value)} disabled = {isUploading}/>

    <select value = {category} onChange={(e) => setCategory(e.target.value)} disabled = {isUploading}>
    {/* <option value="">Choose category:</option> */}
      {CATEGORIES.map((cat) => (<option key = {cat.name} value = {cat.name}>
        {cat.name.toUpperCase()}
      </option>))}
      
    </select>
    <button className="btn btn-large" disabled={isUploading}>Post</button>
  </form>
  );
}

function CategoryFilter(props) {
  const {setCurrentCategory} = props;
  return(
    <aside>
      <ul>
      <li className="category"><button className="btn btn-all-categories" onClick={() => setCurrentCategory("all")}>All</button></li> 

        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
        <button className="btn btn-category" style={{backgroundColor: cat.color}} onClick={() => setCurrentCategory(cat.name)}>
          {cat.name}</button>
        </li>
        )
        )}
      </ul>
    </aside>
  )
}

function FactList(props) {
 const {facts} = props;

 if(facts.length === 0) {
  return <p className="message">No Facts for this category yet!. Create the first one✌️</p>
 }

  return ( <section> <ul className="facts-list">  {
    facts.map((fact) => (
      
      <Fact key={fact.id} factObj={fact}/>
    ))}
    </ul>
    <p>There are {facts.length} facts in the database. Add your own!</p>
    </section>
 );
}

function Fact(props) {
  const {factObj} = props;
  return (
    <li className="fact" >
      <p>
      {factObj.text}
       <a href={factObj.source} target="_blank" className="source">(source)</a>
       </p>
       <span className="tag" style={{backgroundColor:CATEGORIES.find((cat) => cat.name === factObj.category).color}}>
        {factObj.category}
        </span>
       <div  className="vote-buttons"> 
         <button>👍 {factObj.votesInteresting}</button>
         <button>🤯 {factObj.votesMindblowing}</button>
         <button>⛔️ {factObj.votesFalse}</button>
       </div>
   </li>
  )
}

export default App;