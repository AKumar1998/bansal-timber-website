export default function HomeProductsGrid({products}){

  return(
  
    <div className="grid grid-cols-1 mt-15 sm:grid-cols-2 gap-8">
      {products.map((p) => (
        <div key={p.id}>
          <img 
            src={p.image} 
            alt={p.name}
            className="w-full rounded-lg object-cover"
          />
          <p className="mt-3 font-[SagaceMedium]">{p.name}</p>
        </div>
      ))}
    </div>
  
  );

};
