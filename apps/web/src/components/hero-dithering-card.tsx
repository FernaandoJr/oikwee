import { useTranslation } from '@repo/i18n';
import { ArrowRight } from 'lucide-react';
import { Suspense, lazy } from 'react';
import { Header } from './header';

const Dithering = lazy(() =>
  import('@paper-design/shaders-react').then((mod) => ({ default: mod.Dithering })),
);

export function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="w-full select-none">
      <Header />
      <div className="relative w-full">
        <div className="bg-card relative flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden duration-500">
          <Suspense fallback={<div className="bg-muted/20 absolute inset-0" />}>
            <div className="absolute inset-0 z-0">
              <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply">
                <Dithering
                  colorBack="#ffffff"
                  colorFront="#EC4E02"
                  shape="warp"
                  type="4x4"
                  speed={0.8}
                  className="h-full w-full"
                  minPixelRatio={1}
                />
              </div>
              <div className="from-background pointer-events-none absolute inset-0 bg-gradient-to-t to-transparent" />
            </div>
          </Suspense>

          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
            <h2 className="text-foreground mb-8 font-serif text-5xl leading-[1.05] font-medium tracking-tight md:text-7xl lg:text-8xl">
              {t('hero.headline')} <br />
              <span className="text-foreground/80">{t('hero.headlineAccent')}</span>
            </h2>

            <p className="text-muted-foreground mb-12 max-w-2xl text-lg leading-relaxed md:text-xl">
              {t('hero.description')}
            </p>

            <button className="group bg-primary text-primary-foreground hover:bg-primary/90 hover:ring-primary/20 relative inline-flex h-14 cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full px-12 text-base font-medium transition-all duration-300 hover:scale-105 hover:ring-4 active:scale-95">
              <span className="relative z-10">{t('hero.cta')}</span>
              <ArrowRight className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veniam animi nesciunt neque magnam
        itaque, nostrum perferendis eos? Reiciendis consequatur mollitia culpa nisi? Rerum eius in
        ipsum reprehenderit numquam iste voluptas, dolore possimus culpa maiores delectus molestiae
        maxime, id ipsa, minus quod eveniet nesciunt ut perspiciatis veniam expedita! Natus eveniet
        libero pariatur! Unde, porro cumque ullam in, deserunt quidem incidunt aut ipsum laboriosam
        quis dolore expedita vero magnam totam repellendus, quaerat laborum non. Officiis debitis
        doloremque maiores esse harum magni odit possimus voluptatibus, ipsam, sequi distinctio
        voluptatum velit dolor earum labore ab delectus eaque. Recusandae impedit corporis quo.
        Suscipit placeat consequatur maxime dolores sunt consectetur ea officia dolorem rem
        voluptatem sint porro cum at repellendus accusamus unde fuga quisquam ullam eligendi,
        temporibus tempore, sapiente debitis. Eveniet repellendus ipsam, rerum consectetur culpa
        delectus sequi, dolorum dolor obcaecati, voluptatem illo. A voluptate dignissimos officiis
        dolorum earum, ex reiciendis. Neque optio esse at, odio provident error recusandae magnam
        blanditiis ab inventore, soluta nulla veniam illum sint illo perspiciatis cum quidem
        voluptate! Mollitia ex necessitatibus veniam dolorem, ullam ipsum quas asperiores nihil,
        dignissimos doloribus inventore consectetur ipsa reiciendis quidem fuga pariatur aut optio
        corrupti unde quod! Aut accusamus perspiciatis expedita excepturi, id fugiat veritatis
        dolorem! Labore quidem ratione aliquam! Sed aspernatur eum nulla expedita corrupti,
        laudantium vero optio, repellendus natus suscipit quam dolorem facilis, nisi alias. Eius
        ipsam totam quidem iusto aperiam voluptates porro veritatis repellat illum rem?
        Necessitatibus modi possimus expedita impedit doloribus vitae, tenetur a quidem fugiat
        suscipit laudantium veritatis magnam commodi earum aliquid corporis dolorem esse
        reprehenderit vel, doloremque minus? Ducimus repellat sint ad consectetur tempora esse
        consequuntur sapiente reprehenderit debitis fugit sit perferendis adipisci commodi
        consequatur dolorem, quisquam ipsam vel. Voluptate iure accusamus minus repellat sapiente
        maxime rem, officia quis modi pariatur dolorum laborum labore maiores inventore architecto
        aliquam omnis. Recusandae ut error asperiores consequatur facilis dicta animi sit quisquam,
        amet magni pariatur repellat eius aliquam ipsam minima praesentium assumenda dolor magnam
        quam, quos nostrum. Provident pariatur quisquam sapiente consequuntur at sed laborum eum
        officia aut repellendus hic ipsa, recusandae praesentium qui obcaecati perferendis, nostrum
        est vero magnam? Architecto exercitationem doloremque aliquid necessitatibus cupiditate
        voluptatibus ut molestiae adipisci esse ipsa possimus ex amet pariatur nulla quis assumenda
        blanditiis dolore hic consequuntur quo, accusamus minus. Sed unde possimus vel id quaerat
        dolorem laborum quod similique dolor minima neque, temporibus doloremque nostrum est qui
        pariatur earum aperiam nam accusamus adipisci. Reprehenderit atque, quibusdam alias
        accusantium saepe quis, aperiam facilis recusandae aliquid blanditiis quam, esse rem?
        Accusantium qui ullam debitis ea, tenetur numquam in corrupti ut fugiat repudiandae illo est
        doloribus ratione esse magnam nemo? Autem accusamus ducimus voluptate perspiciatis. Aliquid
        vero fugiat possimus a architecto, impedit quam cum provident aspernatur maiores voluptates
        voluptatem delectus adipisci labore animi ducimus aliquam. Commodi consequuntur beatae
        nostrum vel est modi maxime labore rerum temporibus sed dicta sequi sunt sapiente,
        voluptatum quibusdam molestias voluptates. Quasi atque ratione rerum quia praesentium,
        corporis corrupti saepe nesciunt inventore quae quaerat eum porro magni cum. Error possimus
        cupiditate libero. Quos neque ad veniam tempora, molestias deserunt maxime, perspiciatis
        debitis unde iure modi eos aspernatur enim sapiente laborum assumenda ratione adipisci
        expedita qui minus nam itaque officia? Dignissimos aliquam, numquam iure illum incidunt ut
        consectetur eveniet sint nam adipisci fugit nobis iusto placeat animi natus ipsam debitis
        perferendis. Mollitia, ex esse praesentium quidem provident perspiciatis modi molestiae
        quaerat rem doloremque aliquid facere atque quo error veritatis numquam, sapiente corrupti
        voluptas quis aspernatur. Ipsum architecto dignissimos veniam non corporis libero tenetur
        harum voluptate accusamus officia? Vitae dolores assumenda alias incidunt tempora at
        perferendis illo, ab, quos consequuntur blanditiis veniam porro. Libero reprehenderit
        ducimus suscipit laborum quo dignissimos est sit beatae inventore quis sunt doloribus
        reiciendis deserunt fuga quae, nobis dolorem nihil ratione impedit iusto eveniet delectus.
        In nobis rerum molestiae, cum mollitia architecto nisi ullam, nulla asperiores sint
        explicabo corporis eaque qui maiores, aliquam veritatis id neque. Perspiciatis molestiae
        soluta cum neque, amet nobis eligendi necessitatibus ex illo excepturi blanditiis voluptas
        accusantium consectetur ab. Veritatis distinctio obcaecati atque, itaque deleniti fugiat
        aliquam quo magnam, voluptatibus minus similique. Accusantium, excepturi similique minus sit
        facere necessitatibus totam aliquam non enim, id qui blanditiis neque? Minus a, corrupti
        fugit magni maxime, ducimus beatae, rerum ex eveniet quaerat tempora harum iste esse laborum
        quas dolorum eum? Accusamus dolore harum officiis repudiandae distinctio. Obcaecati non,
        aperiam commodi impedit earum possimus, voluptatibus molestias deserunt perferendis rem nam,
        odio praesentium. Quo a reprehenderit recusandae voluptas ratione, quas, magni dolorum quam
        maxime, sint quasi corrupti ipsum laudantium eum modi doloribus officia asperiores soluta
        nobis quia qui! Quisquam voluptatum recusandae nesciunt, nam officiis molestias omnis quod,
        consectetur quas velit debitis illo quasi id, totam quibusdam quae sit eos quia! Aut quas
        voluptates nam assumenda vel corrupti dolorum, veritatis eaque! Provident obcaecati illum
        repudiandae sequi recusandae voluptatem quasi quae et nemo aut, accusamus perspiciatis
        tempora rerum aperiam animi ut ratione iste omnis molestiae exercitationem dolorem culpa
        voluptatibus consequuntur vero? Sapiente magnam quas optio amet quae possimus sit deleniti
        laborum recusandae sint culpa voluptate enim aliquam aspernatur consectetur accusamus ab
        sed, sunt quasi! Officiis iste quo repellendus molestiae, blanditiis fugiat mollitia facilis
        vero odit incidunt aspernatur? Modi, maiores voluptates nihil repellat optio quae
        consequatur in architecto, dicta aliquid distinctio vero dignissimos, soluta qui? Architecto
        illum provident cumque natus vel officia error ipsa! Excepturi optio laudantium aliquam
        autem corporis iure velit aspernatur animi enim nesciunt illo perspiciatis ipsam, mollitia
        ipsum recusandae amet cumque inventore similique delectus non eveniet praesentium, fuga et
        earum. Natus ad perspiciatis nam praesentium. Eligendi, voluptatem illo doloribus eos magnam
        tenetur! Facere similique culpa non placeat nisi veniam! Debitis laboriosam, veniam nostrum
        omnis sunt distinctio. Praesentium, corrupti atque ea libero voluptatum sequi necessitatibus
        iste quas sed ipsam autem modi quis consectetur exercitationem error nostrum a suscipit
        debitis maxime eligendi eos deserunt assumenda repellat adipisci! Aspernatur perspiciatis
        soluta, repudiandae similique fugit eius tempora sed odio cupiditate amet a ipsum cum.
        Eligendi maiores asperiores eaque reiciendis qui hic facilis tempora, exercitationem ducimus
        fugit rerum quidem deleniti excepturi esse dolor saepe! Fuga, sit. Architecto molestias esse
        possimus praesentium nostrum, nam repudiandae at accusantium laborum dicta quo natus maxime
        tempora labore adipisci numquam accusamus. Enim ullam porro molestias dolorem illum.
        Officiis voluptates qui neque perferendis blanditiis laboriosam, sunt dignissimos libero
        dicta rerum enim iste, autem aliquid asperiores odio non vel. Eveniet et quae voluptate hic,
        provident, corporis suscipit aliquid sunt ipsum possimus vel deserunt beatae, impedit qui
        voluptatibus numquam. Officia maiores quod, sequi error labore provident laboriosam?
        Assumenda dolores dolor, consectetur quasi debitis eos optio nam suscipit, inventore dolorum
        aperiam voluptates, adipisci aliquam repellat libero. Repellat magni quo, quae aperiam
        deserunt veritatis qui vel? Saepe cupiditate nobis, doloremque dolores odit laboriosam
        corporis porro? Nesciunt eos, dicta dolore voluptatum ratione vero sunt neque iusto
        assumenda id adipisci beatae iure veniam similique eveniet eius quo voluptatem atque
        expedita fugit sequi doloribus, nobis error. Repellat vel molestiae optio eligendi, adipisci
        suscipit? Eum ratione corporis quas, veritatis alias odit accusamus ad ex magni perspiciatis
        dolorum ea labore quo ipsam officiis aliquid nihil. Molestiae excepturi laudantium impedit
        accusamus ea doloremque distinctio minima quam debitis repudiandae atque libero, porro
        pariatur, nesciunt animi voluptatum! Modi beatae deserunt eum at quis veritatis quisquam
        magnam molestias odio ad veniam accusamus porro rem accusantium nam culpa, ut provident
        assumenda maiores excepturi expedita tempora, aperiam illo officiis. Accusamus provident
        modi labore laudantium cum voluptatem eum nisi officiis dolorem quo, esse amet facere libero
        quidem corporis architecto dolor odio aperiam fugiat tempore?
      </p>
    </section>
  );
}
