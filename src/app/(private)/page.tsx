const HomePage = () => (
  <section className="space-y-6">
    <div className="rounded-xl bg-gradient-to-br from-primary to-purple-500 p-6 text-white shadow-lg">
      <h2 className="text-2xl font-semibold">Bom dia, João</h2>
      <p className="text-sm text-white/80">Confira os compromissos e status das ordens de serviço.</p>
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      {[1, 2, 3].map((item) => (
        <article key={item} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-neutral-800">Cliente #{item}</h3>
          <p className="text-sm text-neutral-500">
            Descrição da visita técnica programada. Este é um placeholder até que a agenda esteja integrada.
          </p>
          <div className="mt-3 text-sm text-neutral-700">
            <p>Telefone: (00) 0000-0000</p>
            <p>Horário: 10:00</p>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default HomePage;
