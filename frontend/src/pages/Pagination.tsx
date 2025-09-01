import { mergeStyleSets, PrimaryButton, Stack, type IStackTokens } from '@fluentui/react'
import React from 'react'


interface PaginationProps {
    currentPage: number,
    totalPages: number,
    onPageChange:(page:number) => void;
}

const stackTokens = {
    childrenGap:10,
}

const stackStyles = mergeStyleSets({
    top:{
       marginTop:'10px',
       width:'100%'
        
    },
    button:{
        height:'fit-content',
        text:'40px'
    }


})

const Pagination: React.FC<PaginationProps>=({currentPage, totalPages ,onPageChange})=>{
    const handleClick=(page:number)=>{
        if(page > 0 && page <= totalPages){
            onPageChange(page);
        }
    }



    return (
        <Stack tokens={stackTokens} className={stackStyles.top} horizontal horizontalAlign='center'>
            <PrimaryButton 
           styles={{root:{
                   padding:'0',height:'0'
                    }
                }}
             onClick={()=>handleClick(currentPage-1)}
             disabled={currentPage == 1}
          
                text="prev"
                type="submit"
            />

              {Array.from({length:totalPages},(_ ,index) =>(
               <button
                 key={index+1}
                 onClick={()=>handleClick(index+1)}
                 style={{padding:'0 10px'}}
                 disabled={currentPage == index+1}
               >
             {index+1}

               </button>


    ))}
            <PrimaryButton 
              onClick={()=>handleClick(currentPage+1)}
                disabled={currentPage == totalPages}
              
                text="Next"
                type="next"
            />
        </Stack>
    )
}

export default Pagination