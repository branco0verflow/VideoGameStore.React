import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CortesYTiposDeCorte = () => {
    const navigate = useNavigate();
    const [cortes, setCortes] = useState([]);
    const [cortesias, setCortesias] = useState([]);
    const [editingCorte, setEditingCorte] = useState(null);
    const [editingCortesia, setEditingCortesia] = useState(null);
    const [nuevoCorte, setNuevoCorte] = useState({ nombre: "", precio: "" });
    const [nuevaCortesia, setNuevaCortesia] = useState({ nombre: "", precio: "" });

    useEffect(() => { fetchCortes(); fetchCortesias(); }, []);

    const fetchCortes = async () => {
        try { setCortes(await (await fetch("https://albo-barber.onrender.com/tipos-de-corte")).json()); }
        catch (e) { console.error(e); }
    };
    const fetchCortesias = async () => {
        try { setCortesias(await (await fetch("https://albo-barber.onrender.com/api/cortesias")).json()); }
        catch (e) { console.error(e); }
    };

    const apiPost = async (url, body) => { await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); };
    const apiPut  = async (url, body) => { await fetch(url, { method: "PUT",  headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); };
    const apiDel  = async (url)       => { await fetch(url, { method: "DELETE" }); };

    const handleAgregarCorte = async () => {
        if (!nuevoCorte.nombre || !nuevoCorte.precio) return;
        await apiPost("https://albo-barber.onrender.com/tipos-de-corte", nuevoCorte);
        fetchCortes(); setNuevoCorte({ nombre: "", precio: "" });
    };
    const handleAgregarCortesia = async () => {
        if (!nuevaCortesia.nombre || !nuevaCortesia.precio) return;
        await apiPost("https://albo-barber.onrender.com/api/cortesias", nuevaCortesia);
        fetchCortesias(); setNuevaCortesia({ nombre: "", precio: "" });
    };
    const handleModificarCorte = async (c) => { await apiPut(`https://albo-barber.onrender.com/tipos-de-corte/${c.id}`, c); fetchCortes(); setEditingCorte(null); };
    const handleModificarCortesia = async (c) => { await apiPut(`https://albo-barber.onrender.com/api/cortesias/${c.id}`, c); fetchCortesias(); setEditingCortesia(null); };
    const handleEliminarCorte = async (id) => { await apiDel(`https://albo-barber.onrender.com/tipos-de-corte/${id}`); fetchCortes(); };
    const handleEliminarCortesia = async (id) => { await apiDel(`https://albo-barber.onrender.com/api/cortesias/${id}`); fetchCortesias(); };

    const ItemRow = ({ item, isEditing, onEdit, onSave, onCancel, onDelete, onChange }) => (
        <div className={`border-b border-white/[0.04] last:border-0 ${isEditing ? "bg-[#0f0f0f]" : "hover:bg-[#0f0f0f]/50"} transition-colors`}>
            {isEditing ? (
                <div className="p-3 space-y-2">
                    <input className="input-field" type="text" value={item.nombre} aria-label="Nombre"
                        onChange={(e) => onChange(item.id, 'nombre', e.target.value)} />
                    <input className="input-field" type="number" value={item.precio} aria-label="Precio"
                        onChange={(e) => onChange(item.id, 'precio', parseFloat(e.target.value))} />
                    <div className="flex gap-2">
                        <button onClick={() => onSave(item)} className="btn-primary flex-1 py-2 text-xs">Guardar</button>
                        <button onClick={onCancel} className="btn-secondary flex-1 py-2 text-xs">Cancelar</button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-between gap-2 px-4 py-3">
                    <div>
                        <span className="font-lato text-white text-sm">{item.nombre}</span>
                        <span className="font-oswald text-white/60 font-semibold ml-2 text-sm">${item.precio}</span>
                    </div>
                    <div className="flex gap-1.5">
                        <button onClick={() => onEdit(item.id)}
                            className="font-oswald text-[9px] tracking-widest uppercase px-3 py-1.5 border border-white/10 text-white/60 hover:bg-white hover:text-black transition-all rounded-lg">
                            Editar
                        </button>
                        <button onClick={() => onDelete(item.id)}
                            className="font-oswald text-[9px] tracking-widest uppercase px-3 py-1.5 border border-red-800/40 text-red-400 hover:bg-red-800 hover:text-white transition-all rounded-lg">
                            Eliminar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    const Section = ({ title, items, editing, onEdit, onSave, onCancel, onDelete, onChange, newItem, setNew, onAdd }) => (
        <div className="bg-[#141414] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06]">
                <h2 className="font-oswald font-semibold text-base text-white tracking-widest uppercase">{title}</h2>
            </div>

            <div className="max-h-56 overflow-y-auto scrollbar-hide">
                {items.map((item) => (
                    <ItemRow key={item.id} item={item}
                        isEditing={editing === item.id}
                        onEdit={onEdit} onSave={onSave} onCancel={onCancel} onDelete={onDelete} onChange={onChange} />
                ))}
            </div>

            <div className="px-4 py-4 border-t border-white/[0.04] space-y-2">
                <p className="font-oswald text-[10px] text-white/30 tracking-widest uppercase">Agregar</p>
                <input className="input-field" type="text" placeholder="Nombre" value={newItem.nombre} aria-label="Nombre"
                    onChange={(e) => setNew({ ...newItem, nombre: e.target.value })} />
                <div className="flex gap-2">
                    <input className="input-field flex-1" type="number" placeholder="Precio" value={newItem.precio} aria-label="Precio"
                        onChange={(e) => setNew({ ...newItem, precio: e.target.value })} />
                    <button onClick={onAdd} className="btn-primary text-xs px-4 w-auto rounded-xl">+</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
          <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="font-oswald text-xs text-white/40 tracking-widest uppercase hover:text-white transition-colors px-3 py-2 border border-white/10 rounded-xl"
                    aria-label="Volver"
                >
                    ←
                </button>
                <h1 className="font-oswald font-semibold text-2xl text-white tracking-widest uppercase">
                    Cortes y Cortesías
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Section
                    title="Tipos de Corte"
                    items={cortes} editing={editingCorte}
                    onEdit={setEditingCorte} onSave={handleModificarCorte}
                    onCancel={() => setEditingCorte(null)} onDelete={handleEliminarCorte}
                    onChange={(id, f, v) => setCortes(cortes.map((c) => c.id === id ? { ...c, [f]: v } : c))}
                    newItem={nuevoCorte} setNew={setNuevoCorte}
                    onAdd={handleAgregarCorte} />

                <Section
                    title="Cortesías"
                    items={cortesias} editing={editingCortesia}
                    onEdit={setEditingCortesia} onSave={handleModificarCortesia}
                    onCancel={() => setEditingCortesia(null)} onDelete={handleEliminarCortesia}
                    onChange={(id, f, v) => setCortesias(cortesias.map((c) => c.id === id ? { ...c, [f]: v } : c))}
                    newItem={nuevaCortesia} setNew={setNuevaCortesia}
                    onAdd={handleAgregarCortesia} />
            </div>
          </div>
        </div>
    );
};

export default CortesYTiposDeCorte;
