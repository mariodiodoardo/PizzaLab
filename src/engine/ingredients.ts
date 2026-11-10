/** Baker's percentages. All yeast ratios here are fresh-yeast fractions of flour mass. */
export function ingredients(dough:number,hydration:number,salt:number,oil:number,freshRatio:number,yeast:'fresh'|'instant'){
 const yeastRatio=yeast==='fresh'?freshRatio:freshRatio/3;
 const flour=dough/(1+hydration/100+salt/100+oil/100+yeastRatio);
 return {flour,water:flour*hydration/100,salt:flour*salt/100,oil:flour*oil/100,yeast:flour*yeastRatio};
}
