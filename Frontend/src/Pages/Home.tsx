const serviceCategories: { title: string; text: string; image: string }[] = [
  {
    title: 'Women',
    text: 'Elegant everyday looks and seasonal statement pieces',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80&auto=format&fit=crop',
  },
  {
    title: 'Men',
    text: 'Sharp essentials, casual layers, and smart staples',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80&auto=format&fit=crop',
  },
  {
    title: 'Kids',
    text: 'Comfortable outfits for school, play, and weekends',
    image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=900&q=80&auto=format&fit=crop',
  },
  {
    title: 'New Arrivals',
    text: 'Fresh drops selected for the current season',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=900&q=80&auto=format&fit=crop',
  },
]

const features: [string, string][] = [
  ['Curated Collections', 'Shop a focused range of apparel designed around everyday comfort, style, and quality.'],
  ['Fast Delivery', 'Get your order processed quickly with clear order updates from checkout to delivery.'],
  ['Best Prices', 'Seasonal promotions, everyday value, and special discounts across popular styles.'],
  ['Quality Fabrics', 'Soft, wearable materials selected for fit, durability, and a polished finish.'],
  ['Easy Shopping', 'Browse by category, size, and style, then move from product page to checkout smoothly.'],
  ['Secure Checkout', 'Account login, protected cart actions, and a dependable purchase flow.'],
]

const martCategories: [string, string][] = [
  ['Topwear', 'T-shirts, shirts, tops'],
  ['Bottomwear', 'Trousers, pants, skirts'],
  ['Winterwear', 'Jackets, hoodies, layers'],
  ['Best Sellers', 'Most-loved customer picks'],
  ['Casual Wear', 'Relaxed daily outfits'],
  ['Party Wear', 'Dressier statement looks'],
  ['Essentials', 'Simple wardrobe foundations'],
  ['New Drops', 'Latest products in store'],
]

const stats: [string, string][] = [
  ['500+', 'Styles Available'],
  ['7 days', 'Return Window'],
  ['24/7', 'Customer Support'],
  ['4.8', 'Average Rating'],
]

interface SectionHeaderProps {
  title: string
  text: string
  accent?: string
  dark?: boolean
}

const SectionHeader = ({ title, text, accent, dark = false }: SectionHeaderProps) => {
  const parts = accent ? title.split(accent) : [title]

  return (
    <div className='mx-auto max-w-2xl text-center'>
      <h2 className={`text-3xl font-black sm:text-4xl ${dark ? 'text-white' : 'text-[#1A1A1A]'}`}>
        {accent ? (
          <>
            {parts[0]}
            <span className='text-[#E8420A]'>{accent}</span>
            {parts[1]}
          </>
        ) : (
          title
        )}
      </h2>
      <p className={`mt-3 text-sm leading-7 sm:text-base ${dark ? 'text-white/55' : 'text-gray-500'}`}>{text}</p>
    </div>
  )
}

interface OfferCardProps {
  label: string
  title: string
  text: string
  dark?: boolean
}

const OfferCard = ({ label, title, text, dark = false }: OfferCardProps) => (
  <article className={`rounded-3xl p-7 text-white ${dark ? 'bg-gradient-to-br from-[#1A1A2E] to-[#2D2D4E]' : 'bg-gradient-to-br from-[#00BFA5] to-[#00897B]'}`}>
    <span className='rounded-full bg-white/20 px-3 py-1 text-xs font-extrabold'>{label}</span>
    <h4 className='mt-4 text-xl font-black'>{title}</h4>
    <p className='mt-2 text-sm text-white/70'>{text}</p>
  </article>
)

const Home = () => {
  return (
    <main className='-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12 bg-white text-[#1A1A1A]'>
      <section className='relative overflow-hidden bg-[#fff3ee] px-4 py-14 sm:px-8 lg:px-16 lg:py-20'>
        <div className='mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.95fr]'>
          <div className='max-w-2xl'>
            <div className='mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#E8420A] shadow-sm'>
              <span className='h-2 w-2 rounded-full bg-[#00BFA5]'></span>
              New Season Collection
            </div>

            <h1 className='text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl'>
              Discover Fashion
              <span className='block text-[#E8420A]'>Made for You</span>
              Shop It Fast
            </h1>

            <p className='mt-5 max-w-xl text-base leading-7 text-gray-600 sm:text-lg'>
              Explore fresh outfits, everyday essentials, best sellers, and seasonal pieces built for confident shopping from home.
            </p>

            <div className='mt-8 grid max-w-xl grid-cols-3 gap-3'>
              {[
                ['500+', 'Styles'],
                ['7 days', 'Returns'],
                ['50K+', 'Customers'],
              ].map(([value, label]) => (
                <div key={label} className='rounded-2xl bg-white p-4 text-center shadow-sm'>
                  <strong className='block text-xl font-extrabold text-[#E8420A]'>{value}</strong>
                  <span className='mt-1 block text-xs font-medium text-gray-500 sm:text-sm'>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className='relative min-h-[360px] overflow-hidden rounded-[32px] shadow-2xl shadow-orange-100'>
            <img
              src='https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=85&auto=format&fit=crop'
              alt='Fashion collection display'
              className='absolute inset-0 h-full w-full object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent'></div>
            <div className='absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 p-5 shadow-lg backdrop-blur'>
              <p className='text-sm font-semibold text-gray-500'>Trending now</p>
              <p className='mt-1 text-2xl font-extrabold text-[#1A1A1A]'>Topwear, denim, jackets, and essentials</p>
            </div>
          </div>
        </div>
      </section>

      <section className='px-4 py-16 sm:px-8 lg:px-16'>
        <div className='mx-auto max-w-7xl'>
          <SectionHeader title='Categories' text='Find the styles you want faster by shopping the main collections.' />
          <div className='mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
            {serviceCategories.map((category) => (
              <article key={category.title} className='group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl'>
                <div className='aspect-[4/3] overflow-hidden bg-[#fff3ee]'>
                  <img src={category.image} alt={category.title} className='h-full w-full object-cover transition duration-500 group-hover:scale-105' />
                </div>
                <div className='p-5'>
                  <h3 className='text-xl font-extrabold'>{category.title}</h3>
                  <p className='mt-2 text-sm text-gray-500'>{category.text}</p>
                  <a href='/collection' className='mt-4 inline-flex text-sm font-bold text-[#E8420A]'>Explore -&gt;</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className='bg-white px-4 py-16 sm:px-8 lg:px-16'>
        <div className='mx-auto max-w-7xl'>
          <SectionHeader title='Why Shop With Us?' text='A smoother fashion shopping experience from discovery to delivery.' accent='With Us?' />
          <div className='mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {features.map(([title, text], index) => (
              <article key={title} className='rounded-3xl border border-orange-100 bg-[#FFF8F5] p-7 text-center transition hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100'>
                <div className='mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8420A] text-xl font-extrabold text-white'>
                  {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className='text-lg font-extrabold'>{title}</h3>
                <p className='mt-3 text-sm leading-7 text-gray-600'>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className='bg-[#1A1A2E] px-4 py-16 text-white sm:px-8 lg:px-16'>
        <div className='mx-auto max-w-7xl'>
          <SectionHeader dark title='Shop by Category' text='Browse our clothing categories for daily wear, statement looks, and seasonal layers.' accent='Category' />
          <div className='mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
            {martCategories.map(([title, text], index) => (
              <article key={title} className='rounded-3xl border border-white/10 bg-white/[0.06] p-7 text-center transition hover:-translate-y-1 hover:border-[#E8420A] hover:bg-[#E8420A]'>
                <div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-lg font-extrabold'>
                  {index + 1}
                </div>
                <h4 className='font-bold'>{title}</h4>
                <span className='mt-2 block text-xs text-white/55'>{text}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className='bg-[#FFF8F5] px-4 py-16 sm:px-8 lg:px-16'>
        <div className='mx-auto max-w-7xl'>
          <SectionHeader title="Today's Special Offers" text="Limited time deals on selected fashion pieces and customer favourites." accent='Special Offers' />

          <div className='mt-10 grid gap-6 lg:grid-cols-[1.45fr_1fr]'>
            <article className='relative min-h-[260px] overflow-hidden rounded-3xl bg-gradient-to-br from-[#E8420A] to-[#FF6B35] p-8 text-white shadow-xl shadow-orange-100'>
              <div className='absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10'></div>
              <div className='relative z-10 max-w-md'>
                <span className='rounded-full bg-white/20 px-4 py-1 text-xs font-extrabold tracking-wide'>HOT DEAL</span>
                <h3 className='mt-5 text-3xl font-black leading-tight sm:text-4xl'>Up to 40% OFF New Season Styles</h3>
                <p className='mt-3 text-sm text-white/85'>Valid on selected topwear, jackets, and everyday essentials.</p>
                <a href='/collection' className='mt-6 inline-flex rounded-full bg-white px-7 py-3 text-sm font-extrabold text-[#E8420A]'>Shop Now -&gt;</a>
              </div>
            </article>

            <div className='grid gap-6'>
              <OfferCard label='25% OFF' title='Best Sellers' text='Customer favourites at better prices' dark />
              <OfferCard label='BUY 2 GET 1' title='Wardrobe Basics' text='Simple staples for everyday outfits' />
            </div>
          </div>

          <div className='mt-8 grid gap-4 rounded-3xl border border-orange-100 bg-white p-5 shadow-lg shadow-orange-100 sm:grid-cols-2 lg:grid-cols-4 lg:p-7'>
            {stats.map(([value, label]) => (
              <div key={label} className='text-center'>
                <div className='text-3xl font-black text-[#E8420A]'>{value}</div>
                <div className='mt-1 text-sm font-medium text-gray-500'>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
