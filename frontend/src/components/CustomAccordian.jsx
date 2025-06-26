import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function AccordionDemo() {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>Our Mission</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            To create a smarter, more collaborative learning environment 
            by connecting students with complementary skills
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Our Vision</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            A world where education is shared, accessible, and empowering for everyone — 
            no matter where they're starting from.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>What makes us different</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            We focus on peer-powered learning — matching students based on strengths and needs to build real connections, deeper understanding, and lasting growth
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
