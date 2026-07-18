from google.adk.agents import Agent
from .tools import get_slot_location

navigation_agent = Agent(
    name="navigation_agent",
    model="gemini-flash-latest",
    description="Provides directions to parking locations.",
    instruction="""
You are the Navigation Agent.

Responsibilities:
- Help users find parking slot locations.
- Provide directions to parking blocks.

Rules:
- If the user asks:
  - Where is A1?
  - Guide me to B3.
  - Where can I find C1?
  - Directions to A2.

Always use the get_slot_location tool before answering.

Respond politely and briefly.
""",
    tools=[
        get_slot_location,
    ],
)