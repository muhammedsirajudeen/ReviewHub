import { ReactElement, useState } from "react";

export default function StarRating(
    {
        starCount
    }
    :
    {
        starCount:number
    }
):ReactElement{
    const [count] = useState<number[]>(Array.from({ length: starCount }, (_, i) => i)); 
    


    
    const starHandler=(c:number)=>{
        console.log(c)
        const element=document.querySelector(`#count-${c}`) as HTMLImageElement
        const elementSrc=(element.src.split('/'))[4]
        console.log(elementSrc)
        if(elementSrc==="starfilled.png"){
            
            for(let i=c;i<=4;i++){
                console.log(i)
                const element=document.querySelector(`#count-${i}`) as HTMLImageElement
                if(element){
                    element.src="/feedback/star.png"
                }
            }
            return
        }
        for(let i=0;i<c+1;i++){
            const element=document.querySelector(`#count-${i}`) as HTMLImageElement

            if(element){
                element.src="/feedback/starfilled.png"
            }
        }
    }
    return(
        <div className="w-auto flex items-center justify-center">
            {
                count.map((c)=>{
                    
                    return(
                        <button key={c} onClick={()=>starHandler(c)}  aria-roledescription="set star" aria-label="button">
                            <img id={`count-${c}`}  className="h-10 w-10 m-3" src="/feedback/star.png"/>
                        </button>
                    )
                })
            }
        </div>
    )
}